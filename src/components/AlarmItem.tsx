import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Alarm } from '../models/Alarm';

interface Props {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatAlarmTime(hour: number, minute: number): string {
  const ampm = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
}

export function AlarmItem({ alarm, onToggle, onDelete }: Props) {
  return (
    <View style={[styles.container, !alarm.enabled && styles.disabled]}>
      <View style={styles.left}>
        <Text style={[styles.time, !alarm.enabled && styles.dimText]}>
          {formatAlarmTime(alarm.miTimeHour, alarm.miTimeMinute)}
        </Text>
        <Text style={styles.sub}>
          {alarm.label || 'MiTime Alarm'} · Solar time
        </Text>
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
  disabled: {
    opacity: 0.5,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  time: {
    fontSize: 32,
    fontWeight: '200',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  dimText: {
    color: '#666',
  },
  sub: {
    fontSize: 12,
    color: '#666',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    color: '#555',
    fontSize: 16,
  },
});
