import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import FocusTimer from '../components/FocusTimer';

export default function FocusScreen() {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';

  return (
    <View className={`flex-1 ${bgColor}`}>
      <View className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Text className={`text-2xl font-bold ${textColor}`}>Focus Timer</Text>
        <Text className={`${secondaryTextColor}`}>
          Stay focused and productive with your tasks
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <FocusTimer />

        <View className="mt-6 bg-light-card dark:bg-dark-card rounded-xl p-6 shadow-md">
          <Text className={`text-xl font-semibold mb-4 ${textColor}`}>
            Focus Tips
          </Text>
          <View className="space-y-3">
            <Text className={secondaryTextColor}>
              🧠 The Pomodoro Technique suggests working for 25 minutes, then taking a 5-minute break.
            </Text>
            <Text className={secondaryTextColor}>
              🎯 Set clear goals before starting your focus session.
            </Text>
            <Text className={secondaryTextColor}>
              🚫 Eliminate distractions by turning off notifications on your devices.
            </Text>
            <Text className={secondaryTextColor}>
              💧 Stay hydrated! Keep water nearby during your focus sessions.
            </Text>
            <Text className={secondaryTextColor}>
              🧘‍♂️ Take deep breaths during breaks to refresh your mind.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}