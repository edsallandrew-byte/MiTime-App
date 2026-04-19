import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMiTimeOffset } from '../utils/solarTime';

interface Props {
  miTime: string;
  longitude: number;
  latitude: number;
}

export function MiTimeClock({ miTime, longitude, latitude }: Props) {
  const offset = getMiTimeOffset(longitude);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your MiTime</Text>
      <Text style={styles.clock}>{miTime}</Text>
      <Text style={styles.offset}>{offset}</Text>
      <View style={styles.coords}>
        <Text style={styles.coordText}>
          {latitude.toFixed(4)}° {latitude >= 0 ? 'N' : 'S'} &nbsp;
          {Math.abs(longitude).toFixed(4)}° {longitude >= 0 ? 'E' : 'W'}
        </Text>
      </View>
      <Text style={styles.note}>Noon = sun directly overhead your location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#888',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  clock: {
    fontSize: 52,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  offset: {
    fontSize: 14,
    color: '#f4a261',
    letterSpacing: 1,
  },
  coords: {
    marginTop: 4,
  },
  coordText: {
    fontSize: 13,
    color: '#aaa',
  },
  note: {
    marginTop: 16,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
