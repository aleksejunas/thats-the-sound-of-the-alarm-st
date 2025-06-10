import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThemedColors } from '@/theme/colors';
import Clock from '../components/Clock';
import ScreenHeader from '../components/ScreenHeader';
import { useAlarms } from '../context/AlarmsContext';
import { useFocusTimer } from '../context/FocusTimerContext';
import {
  Clock as ClockIcon,
  Timer,
  Play,
  Bell,
  BellOff,
} from 'lucide-react-native';
import { router } from 'expo-router';

const DashboardScreen = () => {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = getThemedColors(isDarkMode);
  const { alarms, toggleAlarm } = useAlarms();
  const { startTimer } = useFocusTimer();

  // Get next upcoming alarm
  const now = new Date();
  const activeAlarms = alarms.filter((alarm) => alarm.enabled);
  const nextAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;

  // Get today's active alarms
  const todayActiveAlarms = activeAlarms.slice(0, 3); // Show max 3

  // Format time helper
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: colors.background }}
    >
      <ScreenHeader
        title="Dashboard"
        subtitle="Overview of your alarms and focus sessions"
        showSettingsButton={true}
      />

      <ScrollView className="flex-1 p-4">
        {/* Current Time */}
        <View
          className="p-6 mb-4 rounded-lg items-center"
          style={{ backgroundColor: colors.card }}
        >
          <Clock
            textStyle={{ fontSize: 48 }}
            style={{ color: colors.text.primary }}
          />
        </View>

        {/* Next Alarm */}
        <View
          className="p-4 mb-4 rounded-lg"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-3">
            <ClockIcon size={20} color={colors.primary} />
            <Text
              className="ml-2 text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Next Alarm
            </Text>
          </View>

          {nextAlarm ? (
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {formatTime(nextAlarm.time)}
                </Text>
                <Text style={{ color: colors.text.secondary }}>
                  {nextAlarm.label || 'No label'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleAlarm(nextAlarm.id)}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.surface }}
              >
                {nextAlarm.enabled ? (
                  <Bell size={20} color={colors.primary} />
                ) : (
                  <BellOff size={20} color={colors.text.muted} />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/new-alarm')}
              className="py-3 px-4 rounded-lg border-2 border-dashed items-center"
              style={{ borderColor: colors.border }}
            >
              <Text style={{ color: colors.text.muted }}>
                No alarms set. Tap to create one.
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        {/* TODO: Better buttons (now it's hard to see that they are buttons) */}
        <View
          className="p-4 mb-4 rounded-lg"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text.primary }}
          >
            Quick Actions
          </Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => router.push('/focus')}
              className="flex-1 p-4 rounded-lg flex-row items-center justify-center border-2"
              style={{
                backgroundColor: colors.button.background,
                borderColor: colors.border,
              }}
            >
              <Timer size={20} color={colors.primary} />
              <Text
                className="ml-2 font-medium"
                style={{ color: colors.button.text }}
              >
                Start Focus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/new-alarm')}
              className="flex-1 p-4 rounded-lg flex-row items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Bell size={20} color={colors.primary} />
              <Text
                className="ml-2 font-medium"
                style={{ color: colors.text.primary }}
              >
                New Alarm
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Alarms */}
        {todayActiveAlarms.length > 0 && (
          <View
            className="p-4 mb-4 rounded-lg"
            style={{ backgroundColor: colors.card }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                Today's Alarms
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/alarms')}>
                <Text style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>

            {todayActiveAlarms.map((alarm) => (
              <View
                key={alarm.id}
                className="flex-row items-center justify-between py-2 border-b"
                style={{ borderBottomColor: colors.border }}
              >
                <View className="flex-1">
                  <Text
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {formatTime(alarm.time)}
                  </Text>
                  <Text style={{ color: colors.text.secondary }}>
                    {alarm.label || 'No label'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleAlarm(alarm.id)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  {alarm.enabled ? (
                    <Bell size={16} color={colors.primary} />
                  ) : (
                    <BellOff size={16} color={colors.text.muted} />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Focus Stats Placeholder */}
        <View
          className="p-4 mb-4 rounded-lg"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-3">
            <Timer size={20} color={colors.primary} />
            <Text
              className="ml-2 text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Focus Today
            </Text>
          </View>

          <Text style={{ color: colors.text.secondary }}>
            Focus session tracking coming soon! 🎯
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
