import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { useSolarTime } from '../hooks/useSolarTime';
import { MiTimeClock } from '../components/MiTimeClock';
import { ComparisonView } from '../components/ComparisonView';

export function HomeScreen() {
  const location = useLocation();
  const miTime = useSolarTime(
    location.status === 'ready' ? location.longitude : null
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.brand}>MiTime</Text>

      {location.status === 'loading' && (
        <>
          <ActivityIndicator size="large" color="#f4a261" />
          <Text style={styles.message}>Locating your position…</Text>
        </>
      )}

      {location.status === 'denied' && (
        <Text style={styles.error}>
          Location access is required to calculate your personal solar time.
          Please enable it in Settings.
        </Text>
      )}

      {location.status === 'ready' && (
        <>
          <MiTimeClock
            miTime={miTime}
            longitude={location.longitude}
            latitude={location.latitude}
          />
          <View style={styles.separator} />
          <ComparisonView longitude={location.longitude} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 100,
    paddingHorizontal: 0,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f4a261',
    letterSpacing: 4,
    marginBottom: 8,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#1e1e1e',
  },
  message: {
    color: '#888',
    fontSize: 14,
  },
  error: {
    color: '#e63946',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 32,
  },
});
