import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alarm } from '../models/Alarm';
import { getMiTime } from '../utils/solarTime';

const STORAGE_KEY = 'mitime_alarms';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function scheduleAlarm(alarm: Alarm, longitude: number) {
  await Notifications.cancelScheduledNotificationAsync(alarm.id).catch(() => {});
  if (!alarm.enabled) return;

  // Find next trigger time in MiTime
  const now = new Date();
  const solar = getMiTime(longitude, now);
  const candidate = new Date(now);

  // Offset from solar to device time
  const solarOffsetMs = solar.getTime() - now.getTime()
    - (now.getTimezoneOffset() * 60000);

  // Build a Date at the desired MiTime hour/minute today
  const target = new Date(now);
  target.setHours(alarm.miTimeHour, alarm.miTimeMinute, 0, 0);
  // Convert MiTime target back to device time
  const deviceTarget = new Date(target.getTime() - solarOffsetMs);
  if (deviceTarget <= now) deviceTarget.setDate(deviceTarget.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    identifier: alarm.id,
    content: {
      title: 'MiTime Alarm',
      body: alarm.label || `${alarm.miTimeHour}:${String(alarm.miTimeMinute).padStart(2, '0')} MiTime`,
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: deviceTarget },
  });
}

export function useAlarms(longitude: number | null) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setAlarms(JSON.parse(raw));
    });
  }, []);

  const save = useCallback(async (next: Alarm[]) => {
    setAlarms(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (longitude !== null) {
      await Promise.all(next.map(a => scheduleAlarm(a, longitude)));
    }
  }, [longitude]);

  const addAlarm = useCallback((alarm: Alarm) => {
    save([...alarms, alarm]);
  }, [alarms, save]);

  const toggleAlarm = useCallback((id: string) => {
    const next = alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
    save(next);
  }, [alarms, save]);

  const deleteAlarm = useCallback((id: string) => {
    Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    save(alarms.filter(a => a.id !== id));
  }, [alarms, save]);

  return { alarms, addAlarm, toggleAlarm, deleteAlarm };
}
