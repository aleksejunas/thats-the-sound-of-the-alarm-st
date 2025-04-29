import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAlarms } from './context/AlarmsContext';

// Remove uuid import which is causing issues
// import { v4 as uuidv4 } from 'uuid';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simple function to generate a random ID without crypto
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export default function NewAlarmScreen() {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { createAlarm } = useAlarms();

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  const validateTime = (timeString: string): boolean => {
    // Simple regex for 24-hour time format (00:00 to 23:59)
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(timeString);
  };

  const saveAlarm = () => {
    console.log("Save button pressed - starting alarm creation");
    
    if (isSaving) {
      console.log("Already saving, ignoring duplicate press");
      return;
    }
    
    // Validate time format
    if (!validateTime(time)) {
      console.log("Time validation failed:", time);
      Alert.alert(
        'Invalid Time',
        'Please enter a valid time in 24-hour format (HH:MM)'
      );
      return;
    }
    
    setIsSaving(true);
    
    // Create the alarm object - use our simple ID generator instead of uuid
    const newAlarm = {
      id: generateId(),
      time,
      label: label || 'Alarm',
      days: selectedDays,
      enabled: true,
    };
    
    console.log("Created alarm object:", newAlarm);
    
    // Using immediate function to properly handle async
    (async () => {
      try {
        console.log("Calling createAlarm with:", newAlarm);
        await createAlarm(newAlarm);
        console.log("Alarm saved successfully, navigating back");
        router.back();
      } catch (error) {
        console.error("Error saving alarm:", error);
        Alert.alert(
          'Error',
          'Failed to save the alarm. Please try again.'
        );
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 pt-16 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#60a5fa" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text-primary">New Alarm</Text>
        <TouchableOpacity 
          onPress={saveAlarm}
          disabled={isSaving}
          className={isSaving ? "opacity-50" : ""}
        >
          <Text className="text-primary text-base font-semibold">
            {isSaving ? "Saving..." : "Save"}
          </Text>
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
