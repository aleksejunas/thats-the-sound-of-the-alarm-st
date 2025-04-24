import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { addAlarm } from './lib/storage';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function NewAlarmScreen() {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day],
    );
  };

  const saveAlarm = async () => {
    await addAlarm({
      time,
      label,
      days: selectedDays,
      enabled: true,
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 pt-16 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-primary">New Alarm</Text>
        <TouchableOpacity onPress={saveAlarm}>
          <Text className="text-primary text-base font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4 gap-6">
        <TextInput
          className="text-5xl font-bold text-text-primary text-center"
          value={time}
          onChangeText={setTime}
          placeholder="07:00"
          placeholderTextColor="#666"
          keyboardType="numbers-and-punctuation"
        />

        <TextInput
          className="text-lg text-text-primary border-b border-border py-2"
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm label"
          placeholderTextColor="#666"
        />

        <View className="flex-row justify-between gap-2">
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selectedDays.includes(day) ? 'bg-primary' : 'bg-surface'
              }`}
              onPress={() => toggleDay(day)}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedDays.includes(day)
                    ? 'text-text-primary'
                    : 'text-text-secondary'
                }`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
