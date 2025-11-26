import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { isDarkMode, colors, userData } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // State for Trip Logic
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [tripDistance, setTripDistance] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const [driverScore, setDriverScore] = useState(100);
  const [locationSubscription, setLocationSubscription] = useState(null);

  // Refs
  const lastLocation = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Pulse animation for status indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation for speed ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Cleanup on unmount
    return () => {
      stopTrip();
    };
  }, []);

  const startTrip = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    setIsRecording(true);
    setTripDistance(0);
    setTripDuration(0);
    setDriverScore(100);
    setCurrentSpeed(0);
    lastLocation.current = null;

    // Start Timer
    timerRef.current = setInterval(() => {
      setTripDuration((prev) => prev + 1);
    }, 1000);

    // Start Location Tracking
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { speed, latitude, longitude } = location.coords;

        // Speed is in m/s, convert to km/h. Handle negative speed (invalid) as 0.
        const speedKmh = speed < 0 ? 0 : speed * 3.6;
        setCurrentSpeed(Math.round(speedKmh));

        // Calculate Distance
        if (lastLocation.current) {
          const distance = calculateDistance(
            lastLocation.current.latitude,
            lastLocation.current.longitude,
            latitude,
            longitude
          );
          setTripDistance((prev) => prev + distance);
        }
        lastLocation.current = { latitude, longitude };

        // Calculate Score
        calculateScore(speedKmh);
      }
    );
    setLocationSubscription(sub);
  };

  const stopTrip = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    setCurrentSpeed(0);

    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Save Trip to Firestore
    try {
      if (auth.currentUser) {
        // Optimistic Alert - don't wait for the promise to resolve to show success
        Alert.alert("Trip Saved", `Distance: ${tripDistance.toFixed(2)} km\nScore: ${driverScore}`);

        await addDoc(collection(db, "trips"), {
          userId: auth.currentUser.uid,
          distance: parseFloat(tripDistance.toFixed(2)),
          duration: formatDuration(tripDuration),
          durationSeconds: tripDuration,
          score: driverScore,
          date: serverTimestamp(),
        });
      } else {
        Alert.alert("Trip Ended", "User not logged in. Trip not saved.");
      }
    } catch (error) {
      console.error("Error saving trip: ", error);
      // Only alert on error
      Alert.alert("Error", "Failed to save trip data.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const calculateScore = (speed) => {
    // Simple penalty logic: if speed > 100 km/h, deduct points
    if (speed > 100) {
      setDriverScore((prev) => Math.max(0, prev - 1));
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={colors.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <LinearGradient
                colors={['#5A5CFF', '#7B7DFF']}
                style={styles.profileIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.profileText}>{userData?.initials || 'JD'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Speed Card */}
          <View style={styles.speedCardContainer}>
            <Animated.View
              style={[
                styles.speedRing,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <LinearGradient
                colors={['#5A5CFF', '#7B7DFF', '#5A5CFF', '#7B7DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.speedRingGradient}
              />
            </Animated.View>

            <View style={[styles.speedCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
              <LinearGradient
                colors={colors.cardBg}
                style={styles.speedCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.speedLabel, { color: colors.subText }]}>CURRENT SPEED</Text>
                <Text style={[styles.speedValue, { color: colors.text }]}>{currentSpeed}</Text>
                <Text style={[styles.speedUnit, { color: colors.subText }]}>km/h</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Status - Moved Above Buttons */}
          <View style={styles.statusContainer}>
            <Animated.View
              style={[
                styles.statusIndicator,
                { opacity: pulseAnim },
                !isRecording && { backgroundColor: '#FF5C5C' }
              ]}
            />
            <Text style={[styles.statusText, { color: colors.subText }]}>
              Status: {isRecording ? "Recording..." : "Idle"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.buttonWrapper, isRecording && { opacity: 0.5 }]}
              onPress={startTrip}
              disabled={isRecording}
            >
              <LinearGradient
                colors={['#00D9A3', '#00B87A']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Start Trip</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.buttonWrapper, !isRecording && { opacity: 0.5 }]}
              onPress={stopTrip}
              disabled={!isRecording}
            >
              <LinearGradient
                colors={['#FF5C5C', '#E63946']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Stop Trip</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Trip Summary Card */}
          <View style={[styles.summaryCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
            <LinearGradient
              colors={colors.cardBg}
              style={styles.summaryCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Current Trip</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>{tripDistance.toFixed(1)}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.subText }]}>DISTANCE (KM)</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>{driverScore}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.subText }]}>SCORE</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>{Math.floor(tripDuration / 60)}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.subText }]}>MINUTES</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Safe Drive Message Card */}
          <View style={[styles.messageCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.messageCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.messageText}>Drive Safe, Arrive Safe 🚗✨</Text>
              <Text style={styles.subMessageText}>Keep your eyes on the road!</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  speedCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
    height: width * 0.7,
  },
  speedRing: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    padding: 2,
  },
  speedRingGradient: {
    flex: 1,
    borderRadius: width * 0.325,
  },
  speedCard: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  speedCardGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  speedValue: {
    fontSize: 80,
    fontWeight: '700',
    lineHeight: 80,
  },
  speedUnit: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D9A3',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  summaryCardGradient: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 30,
  },
  messageCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  messageCardGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessageText: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
  },
});

export default DashboardScreen;