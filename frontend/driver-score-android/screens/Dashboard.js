import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#0B0C1E', '#181A3A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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
            
            <View style={styles.speedCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.speedCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.speedLabel}>CURRENT SPEED</Text>
                <Text style={styles.speedValue}>68</Text>
                <Text style={styles.speedUnit}>km/h</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#00D9A3', '#00B87A']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Start Trip</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.buttonWrapper}>
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
              style={styles.summaryCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
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
                </View>
              </View>
            </LinearGradient>
          </View>
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
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
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
  },
  speedCardGradient: {
    width: '100%',
    height: '100%',
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
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
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
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D9A3',
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
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
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
  },
});

export default DashboardScreen;