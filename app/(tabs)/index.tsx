import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeDemo from '../components/ThemeDemo';

export default function DashboardScreen() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  // Theme-based styles
  const textColor = isDarkMode
    ? 'text-dark-text-primary'
    : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode
    ? 'text-dark-text-secondary'
    : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';
  const cardBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';

  // Removed the router.replace() navigation that was causing issues

  return (
    <View className={`flex-1 ${bgColor}`} style={{ paddingTop: insets.top }}>
      <View className={`p-4 border-b ${borderColor}`}>
        <Text className={`text-2xl font-bold ${textColor}`}>Dashboard</Text>
        <Text className={`${secondaryTextColor}`}>
          Overview of your alarms and focus sessions
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View
          className={`p-6 mb-4 rounded-lg border ${borderColor} ${cardBgColor}`}
        >
          <View className="flex-row items-center mb-2">
            <Clock size={20} color={isDarkMode ? '#cbd5e1' : '#64748b'} />
            <Text className={`ml-2 text-lg font-medium ${textColor}`}>
              Upcoming Alarms
            </Text>
          </View>
          <Text className={secondaryTextColor}>
            Please navigate to the Alarms tab to see and manage your alarms.
          </Text>
          <ThemeDemo />
        </View>
      </ScrollView>
    </View>
  );
}
