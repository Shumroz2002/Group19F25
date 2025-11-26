<<<<<<< HEAD
import React, { useEffect, useState, useRef } from 'react';
=======
import React, { useEffect, useRef } from 'react';
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
<<<<<<< HEAD
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

=======
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
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
<<<<<<< HEAD

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

=======
  }, []);

>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
<<<<<<< HEAD
      colors={colors.background}
=======
      colors={['#0B0C1E', '#181A3A']}
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
<<<<<<< HEAD
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
=======
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <LinearGradient
              colors={['#5A5CFF', '#7B7DFF']}
              style={styles.profileIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.profileText}>JD</Text>
            </LinearGradient>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
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
<<<<<<< HEAD

            <View style={[styles.speedCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
              <LinearGradient
                colors={colors.cardBg}
=======
            
            <View style={styles.speedCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
                style={styles.speedCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
<<<<<<< HEAD
                <Text style={[styles.speedLabel, { color: colors.subText }]}>CURRENT SPEED</Text>
                <Text style={[styles.speedValue, { color: colors.text }]}>{currentSpeed}</Text>
                <Text style={[styles.speedUnit, { color: colors.subText }]}>km/h</Text>
=======
                <Text style={styles.speedLabel}>CURRENT SPEED</Text>
                <Text style={styles.speedValue}>68</Text>
                <Text style={styles.speedUnit}>km/h</Text>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
              </LinearGradient>
            </View>
          </View>

<<<<<<< HEAD
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
=======
          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
              <LinearGradient
                colors={['#00D9A3', '#00B87A']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Start Trip</Text>
              </LinearGradient>
            </TouchableOpacity>

<<<<<<< HEAD
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.buttonWrapper, !isRecording && { opacity: 0.5 }]}
              onPress={stopTrip}
              disabled={!isRecording}
            >
=======
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
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

<<<<<<< HEAD
          {/* Trip Summary Card */}
          <View style={[styles.summaryCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
            <LinearGradient
              colors={colors.cardBg}
=======
          {/* Status */}
          <View style={styles.statusContainer}>
            <Animated.View
              style={[
                styles.statusIndicator,
                { opacity: pulseAnim },
              ]}
            />
            <Text style={styles.statusText}>Status: Recording...</Text>
          </View>

          {/* Trip Summary Card */}
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
              style={styles.summaryCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
<<<<<<< HEAD
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
=======
              <Text style={styles.summaryTitle}>Trip Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>15</Text>
                  <Text style={styles.summaryLabel}>DISTANCE</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>92</Text>
                  <Text style={styles.summaryLabel}>SCORE</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>22</Text>
                  <Text style={styles.summaryLabel}>DURATION</Text>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
                </View>
              </View>
            </LinearGradient>
          </View>
<<<<<<< HEAD

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
=======
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <View style={styles.activeIndicator} />
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
          </View>
          <TouchableOpacity style={styles.navItem}>
            <Text style={[styles.navIcon, styles.navIconInactive]}>📊</Text>
            <Text style={styles.navLabel}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={[styles.navIcon, styles.navIconInactive]}>⚙</Text>
            <Text style={styles.navLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
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
<<<<<<< HEAD
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
=======
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 10,
=======
    marginBottom: 40,
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
<<<<<<< HEAD
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
=======
    color: '#FFFFFF',
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A5CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  profileText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  speedCardContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    height: 240,
    justifyContent: 'center',
  },
  speedRing: {
    position: 'absolute',
    width: 228,
    height: 228,
    borderRadius: 114,
  },
  speedRingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 114,
    opacity: 0.6,
  },
  speedCard: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  speedCardGradient: {
    width: '100%',
    height: '100%',
<<<<<<< HEAD
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
=======
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLabel: {
    fontSize: 13,
    color: '#A0A0A0',
    marginBottom: 8,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  speedValue: {
    fontSize: 52,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  speedUnit: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 8,
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
<<<<<<< HEAD
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
=======
  },
  button: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    marginBottom: 16,
=======
    marginBottom: 24,
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D9A3',
<<<<<<< HEAD
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
=======
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#E5E5E5',
    fontWeight: '500',
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryCardGradient: {
    padding: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
<<<<<<< HEAD
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
=======
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#A0A0A0',
    letterSpacing: 1,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(11, 12, 30, 0.98)',
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    backgroundColor: '#5A5CFF',
    borderRadius: 2,
    shadowColor: '#5A5CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconInactive: {
    opacity: 0.5,
  },
  navLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#5A5CFF',
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
  },
});

export default DashboardScreen;