import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
// import { useThemedStyles } from '../../hooks/useThemedStyles';
import { Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeDemo from '../components/ThemeDemo';
import { getThemedColors } from '@/theme/colors';
import { styled } from 'nativewind';

export default function DashboardScreen() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = getThemedColors(isDarkMode);

  // const { styles } = useThemedStyles();

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: colors.background }}
    >
      <View
        className="p-4 border-b"
        style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
      >
        <Text
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Dashboard
        </Text>
        <Text style={{ color: colors.text.secondary }}>
          Overview of your alarms and focus sessions
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View
          className="p-6 mb-4 rounded-lg border"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-2">
            <Clock size={20} color={colors.text.muted} />
            <Text
              className="ml-2 text-lg font-medium"
              style={{ color: colors.text.primary }}
            >
              Upcoming Alarms
            </Text>
          </View>
          <Text style={{ color: colors.text.secondary }}>
            Please navigate to the Alarms tab to see and manage your alarms.
          </Text>
          <ThemeDemo />
        </View>
      </ScrollView>
    </View>
  );
}
