import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Alarm } from '../models/Alarm';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (alarm: Alarm) => void;
}

export function AddAlarmModal({ visible, onClose, onAdd }: Props) {
  const [hour, setHour] = useState('7');
  const [minute, setMinute] = useState('00');
  const [label, setLabel] = useState('');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const handleAdd = () => {
    const h24 = ampm === 'AM'
      ? (parseInt(hour) % 12)
      : (parseInt(hour) % 12) + 12;
    const m = parseInt(minute) || 0;
    if (isNaN(h24) || h24 < 0 || h24 > 23 || m < 0 || m > 59) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd({
      id: Date.now().toString(),
      label: label.trim(),
      miTimeHour: h24,
      miTimeMinute: m,
      enabled: true,
    });
    setHour('7'); setMinute('00'); setLabel(''); setAmpm('AM');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text style={styles.title}>New MiTime Alarm</Text>
                <Text style={styles.hint}>Time is in your personal solar time</Text>

                <View style={styles.timeRow}>
                  <TextInput
                    style={styles.timeInput}
                    value={hour}
                    onChangeText={setHour}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                    placeholderTextColor="#555"
                    returnKeyType="next"
                  />
                  <Text style={styles.colon}>:</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={minute}
                    onChangeText={setMinute}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                    placeholderTextColor="#555"
                    returnKeyType="next"
                  />
                  <View style={styles.ampmToggle}>
                    {(['AM', 'PM'] as const).map(v => (
                      <TouchableOpacity
                        key={v}
                        style={[styles.ampmBtn, ampm === v && styles.ampmActive]}
                        onPress={() => setAmpm(v)}
                      >
                        <Text style={[styles.ampmText, ampm === v && styles.ampmTextActive]}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TextInput
                  style={styles.labelInput}
                  placeholder="Label (optional)"
                  placeholderTextColor="#555"
                  value={label}
                  onChangeText={setLabel}
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Text style={styles.addText}>Add Alarm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    gap: 16,
    paddingBottom: 48,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  timeInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 40,
    fontWeight: '200',
    width: 72,
    textAlign: 'center',
    borderRadius: 10,
    padding: 8,
    fontVariant: ['tabular-nums'],
  },
  colon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '200',
  },
  ampmToggle: {
    gap: 6,
    marginLeft: 8,
  },
  ampmBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  ampmActive: {
    backgroundColor: '#f4a261',
  },
  ampmText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  ampmTextActive: {
    color: '#fff',
  },
  labelInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
  addBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f4a261',
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
