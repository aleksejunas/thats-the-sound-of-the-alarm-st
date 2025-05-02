import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Clock, Calendar, Save } from 'lucide-react-native';
import { useAlarms } from './context/AlarmsContext';
import { useTheme } from './context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simple function to generate a random ID without crypto
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export default function NewAlarmScreen() {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { createAlarm } = useAlarms();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  // Theme-based styles
  const textColor = isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';
  const cardBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';

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
    console.log('Save button pressed - starting alarm creation');

    if (isSaving) {
      console.log('Already saving, ignoring duplicate press');
      return;
    }

    // Validate time format
    if (!validateTime(time)) {
      console.log('Time validation failed:', time);
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

    console.log('Created alarm object:', newAlarm);

    // Using immediate function to properly handle async
    (async () => {
      try {
        console.log('Calling createAlarm with:', newAlarm);
        await createAlarm(newAlarm);
        console.log('Alarm saved successfully, navigating back');
        router.back();
      } catch (error) {
        console.error('Error saving alarm:', error);
        Alert.alert('Error', 'Failed to save the alarm. Please try again.');
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <View className={`flex-1 ${bgColor}`} style={{ paddingTop: insets.top }}>
      <View className={`flex-row items-center justify-between p-4 border-b ${borderColor}`}>
        <TouchableOpacity 
          className="p-2" 
          onPress={() => router.back()}
        >
          <ChevronLeft 
            color={isDarkMode ? "#cbd5e1" : "#64748b"} 
            size={24} 
          />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${textColor}`}>New Alarm</Text>
        <TouchableOpacity
          className={`p-2 ${isSaving ? 'opacity-50' : ''}`}
          onPress={saveAlarm}
          disabled={isSaving}
        >
          <Save 
            color="#4f46e5" 
            size={24} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className={`p-6 mb-4 rounded-lg border ${borderColor} ${cardBgColor}`}>
          <View className="flex-row items-center mb-4">
            <Clock size={20} color={isDarkMode ? "#cbd5e1" : "#64748b"} />
            <Text className={`ml-2 text-lg font-medium ${textColor}`}>Time</Text>
          </View>
          
          <TextInput
            className={`text-5xl font-bold ${textColor} text-center p-4`}
            value={time}
            onChangeText={setTime}
            placeholder="07:00"
            placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View className={`p-6 mb-4 rounded-lg border ${borderColor} ${cardBgColor}`}>
          <Text className={`mb-2 text-lg font-medium ${textColor}`}>Label</Text>
          <TextInput
            className={`border-b ${borderColor} pb-2 ${textColor}`}
            value={label}
            onChangeText={setLabel}
            placeholder="Alarm label"
            placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
          />
        </View>

        <View className={`p-6 rounded-lg border ${borderColor} ${cardBgColor}`}>
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color={isDarkMode ? "#cbd5e1" : "#64748b"} />
            <Text className={`ml-2 text-lg font-medium ${textColor}`}>Repeat on Days</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                className={`mb-3 w-12 h-12 rounded-full items-center justify-center ${
                  selectedDays.includes(day) ? 'bg-primary' : isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'
                }`}
                onPress={() => toggleDay(day)}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedDays.includes(day) ? 'text-white' : isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text className={`mt-2 text-center ${secondaryTextColor}`}>
            {selectedDays.length === 0 
              ? 'Alarm will ring only once' 
              : selectedDays.length === 7 
                ? 'Alarm will ring every day' 
                : `Alarm will ring on ${selectedDays.join(', ')}`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}