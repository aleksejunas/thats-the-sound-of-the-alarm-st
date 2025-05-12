import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import FocusTimer from '../components/FocusTimer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FocusScreen() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const textColor = isDarkMode
    ? 'text-dark-text-primary'
    : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode
    ? 'text-dark-text-secondary'
    : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';
  const cardBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';

  // Use the custom focus tips color for light mode
  const focusTipsColor = isDarkMode
    ? 'text-white'
    : 'text-light-text-focusTips';

  return (
    <View className={`flex-1 ${bgColor}`} style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1 p-4">
        <FocusTimer />

        <View className={`mt-6 mb-10 ${cardBgColor} rounded-xl p-6 shadow-md`}>
          <Text
            style={{ color: isDarkMode ? '#ffffff' : '#3730a3' }}
            className="text-xl font-semibold mb-4"
          >
            Focus Tips
          </Text>
          <View className="space-y-3">
            <Text className={secondaryTextColor}>
              🧠 The Pomodoro Technique suggests working for 25 minutes, then
              taking a 5-minute break.
            </Text>
            <Text className={secondaryTextColor}>
              🎯 Set clear goals before starting your focus session.
            </Text>
            <Text className={secondaryTextColor}>
              🚫 Eliminate distractions by turning off notifications on your
              devices.
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
