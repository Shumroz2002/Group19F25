import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const SummaryScreen = () => {
  const { isDarkMode, colors } = useTheme();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgScore: 0,
    totalDistance: 0,
    totalTrips: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const loadCachedTrips = async () => {
      try {
        const cachedTrips = await AsyncStorage.getItem(`trips_${auth.currentUser.uid}`);
        if (cachedTrips) {
          const parsedTrips = JSON.parse(cachedTrips);
          setTrips(parsedTrips);
          calculateStats(parsedTrips);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load cached trips", e);
      }
    };

    loadCachedTrips();

    const q = query(
      collection(db, "trips"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTrips = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Timestamp to serializable format for caching
        date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString() : new Date().toISOString()
      }));

      setTrips(fetchedTrips);
      calculateStats(fetchedTrips);
      setLoading(false);

      // Cache the new trips
      AsyncStorage.setItem(`trips_${auth.currentUser.uid}`, JSON.stringify(fetchedTrips)).catch(e => console.error(e));
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = (tripData) => {
    if (tripData.length === 0) {
      setStats({ avgScore: 0, totalDistance: 0, totalTrips: 0 });
      return;
    }

    const totalDist = tripData.reduce((acc, trip) => acc + (trip.distance || 0), 0);
    const totalScore = tripData.reduce((acc, trip) => acc + (trip.score || 0), 0);
    const avg = totalScore / tripData.length;

    setStats({
      avgScore: Math.round(avg),
      totalDistance: parseFloat(totalDist.toFixed(2)),
      totalTrips: tripData.length,
    });
  };

  const renderTripItem = ({ item }) => (
    <View style={[styles.tripCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
      <LinearGradient
        colors={colors.cardBg}
        style={styles.tripCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.tripHeader}>
          <Text style={[styles.tripDate, { color: colors.subText }]}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item.score) }]}>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        </View>
        <View style={styles.tripDetails}>
          <View>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.distance} km</Text>
            <Text style={[styles.detailLabel, { color: colors.subText }]}>Distance</Text>
          </View>
          <View>
            <Text style={[styles.detailValue, { color: colors.text }]}>{item.duration}</Text>
            <Text style={[styles.detailLabel, { color: colors.subText }]}>Duration</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const getScoreColor = (score) => {
    if (score >= 90) return '#00D9A3';
    if (score >= 70) return '#FFD166';
    return '#FF5C5C';
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background[0] }]}>
        <ActivityIndicator size="large" color="#5A5CFF" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Summary</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
            <LinearGradient
              colors={colors.cardBg}
              style={styles.statCardGradient}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.avgScore}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>AVG SCORE</Text>
            </LinearGradient>
          </View>
          <View style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
            <LinearGradient
              colors={colors.cardBg}
              style={styles.statCardGradient}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalDistance}</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>TOTAL KM</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Trips</Text>
          {trips.length === 0 ? (
            <Text style={[styles.noTripsText, { color: colors.subText }]}>No trips recorded yet.</Text>
          ) : (
            <FlatList
              data={trips}
              renderItem={renderTripItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 0.48,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  tripCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tripCardGradient: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 14,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#181A3A',
    fontWeight: '700',
    fontSize: 14,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailLabel: {
    fontSize: 12,
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default SummaryScreen;
