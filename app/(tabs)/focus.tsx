import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import FocusTimer from '../components/FocusTimer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThemedColors } from '../../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const FocusScreen = () => {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = getThemedColors(isDarkMode);

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: colors.background }}
    >
      <ScreenHeader
        title="Focus"
        subtitle="Stay focused with Pomodoro timers"
      />

      <ScrollView className="flex-1 p-4">
        <FocusTimer />

        <View
          className="mt-6 mb-10 rounded-xl p-6 shadow-md"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-xl font-semibold mb-4"
            style={{ color: isDarkMode ? '#fff' : colors.primary }}
          >
            Focus Tips
          </Text>
          <View className="space-y-3">
            <Text style={{ color: colors.text.secondary }}>
              🧠 The Pomodoro Technique suggests working for 25 minutes, then
              taking a 5-minute break.
            </Text>
            <Text style={{ color: colors.text.secondary }}>
              🎯 Set clear goals before starting your focus session.
            </Text>
            <Text style={{ color: colors.text.secondary }}>
              🚫 Eliminate distractions by turning off notifications on your
              devices.
            </Text>
            <Text style={{ color: colors.text.secondary }}>
              💧 Stay hydrated! Keep water nearby during your focus sessions.
            </Text>
            <Text style={{ color: colors.text.secondary }}>
              🧘‍♂️ Take deep breaths during breaks to refresh your mind.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FocusScreen;
