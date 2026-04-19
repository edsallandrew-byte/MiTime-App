import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Alarm } from '../models/Alarm';
import { getStandardTimeForMiTime, formatStandardAlarmTime } from '../utils/solarTime';

interface Props {
  alarm: Alarm;
  longitude: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatMiTimeHM(hour: number, minute: number): string {
  const ampm = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
}

export function AlarmItem({ alarm, longitude, onToggle, onDelete }: Props) {
  const nextStdTime = getStandardTimeForMiTime(
    alarm.miTimeHour, alarm.miTimeMinute, longitude
  );
  const stdLabel = formatStandardAlarmTime(nextStdTime);
  const isToday = nextStdTime.toDateString() === new Date().toDateString();
  const dayLabel = isToday ? 'today' : 'tomorrow';

  return (
    <View style={[styles.container, !alarm.enabled && styles.disabled]}>
      <View style={styles.left}>
        <Text style={styles.miLabel}>MiTime</Text>
        <Text style={[styles.time, !alarm.enabled && styles.dimText]}>
          {formatMiTimeHM(alarm.miTimeHour, alarm.miTimeMinute)}
        </Text>
        {alarm.label ? <Text style={styles.alarmLabel}>{alarm.label}</Text> : null}

        {alarm.enabled && (
          <View style={styles.stdRow}>
            <Text style={styles.stdPrefix}>Set alarm for </Text>
            <Text style={styles.stdTime}>{stdLabel}</Text>
            <Text style={styles.stdPrefix}> {dayLabel}</Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        <Switch
          value={alarm.enabled}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#333', true: '#f4a26180' }}
          thumbColor={alarm.enabled ? '#f4a261' : '#666'}
        />
        <TouchableOpacity onPress={() => onDelete(alarm.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  disabled: { opacity: 0.5 },
  left: { flex: 1, gap: 3 },
  miLabel: {
    fontSize: 10,
    color: '#f4a261',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 32,
    fontWeight: '200',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  dimText: { color: '#666' },
  alarmLabel: { fontSize: 12, color: '#666' },
  stdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  stdPrefix: { fontSize: 11, color: '#666' },
  stdTime: { fontSize: 11, color: '#90e0ef', fontWeight: '600' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deleteBtn: { padding: 4 },
  deleteText: { color: '#555', fontSize: 16 },
});
