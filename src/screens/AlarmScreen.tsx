import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAlarms } from '../hooks/useAlarms';
import { useLocation } from '../hooks/useLocation';
import { AlarmItem } from '../components/AlarmItem';
import { AddAlarmModal } from '../components/AddAlarmModal';

export function AlarmScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const location = useLocation();
  const longitude = location.status === 'ready' ? location.longitude : null;
  const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useAlarms(longitude);

  useEffect(() => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      setPermissionGranted(status === 'granted');
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.brand}>Alarms</Text>
        <Text style={styles.sub}>Set in your personal MiTime</Text>

        {!permissionGranted && (
          <View style={styles.permBanner}>
            <Text style={styles.permText}>
              Enable notifications in Settings to hear alarms.
            </Text>
          </View>
        )}

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {alarms.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No alarms set</Text>
              <Text style={styles.emptyHint}>
                Tap + to add your first MiTime alarm
              </Text>
            </View>
          ) : (
            alarms.map(alarm => (
              <AlarmItem
                key={alarm.id}
                alarm={alarm}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
              />
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <AddAlarmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addAlarm}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f4a261',
    letterSpacing: 2,
  },
  sub: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    marginBottom: 20,
    letterSpacing: 1,
  },
  permBanner: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#e63946',
  },
  permText: {
    color: '#aaa',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyText: {
    color: '#444',
    fontSize: 18,
    fontWeight: '300',
  },
  emptyHint: {
    color: '#333',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f4a261',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f4a261',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
});
