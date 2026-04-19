import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMiTime } from '../utils/solarTime';

interface Props {
  longitude: number;
}

function formatStandard(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatMiTime(date: Date): string {
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`;
}

function getDiffLabel(diffMs: number): string {
  const totalSec = Math.round(Math.abs(diffMs) / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const sign = diffMs >= 0 ? 'ahead of' : 'behind';
  if (h > 0) return `${h}h ${m}m ${sign} standard time`;
  if (m > 0) return `${m}m ${s}s ${sign} standard time`;
  return `${s}s ${sign} standard time`;
}

export function ComparisonView({ longitude }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const miTime = getMiTime(longitude, now);
  const diffMs = miTime.getTime() - Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    now.getHours(), now.getMinutes(), now.getSeconds()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Time Comparison</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>MiTime</Text>
          <Text style={styles.cardTime}>{formatMiTime(miTime)}</Text>
          <Text style={styles.cardSub}>Your solar time</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Standard</Text>
          <Text style={[styles.cardTime, styles.standardColor]}>
            {formatStandard(now)}
          </Text>
          <Text style={styles.cardSub}>
            {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.diffBadge}>
        <Text style={styles.diffText}>{getDiffLabel(diffMs)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 16,
  },
  heading: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  cardLabel: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardTime: {
    fontSize: 18,
    fontWeight: '300',
    color: '#f4a261',
    fontVariant: ['tabular-nums'],
  },
  standardColor: {
    color: '#90e0ef',
  },
  cardSub: {
    fontSize: 10,
    color: '#555',
  },
  divider: {
    width: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 16,
  },
  diffBadge: {
    backgroundColor: '#1a1a1a',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  diffText: {
    fontSize: 12,
    color: '#888',
  },
});
