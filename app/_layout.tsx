import '../global.css';

// TODO: [x] - Update the alarm screen after adding a new alarm
// TODO: [] - Change the styling to look more like the sidetrack-slayer-app
// TODO: [] - Option to lock down the device for 10 minutes after waking up
// TODO: [] - Add i18n support for translations
// ---- TOASTS ----
// TODO: [x] - Add a toast notification when the alarm is set
// TODO: [] - Add a toast notification when the alarm is deleted
// TODO: [x] - Add a toast notification when the alarm is edited
// TODO: [] - Add a toast notification when the alarm goes off
// TODO: [] - Add a toast notification when the alarm is snoozed
// TODO: [] - Add a toast notification when the alarm is stopped
// TODO: [] - Add a toast notification when the alarm is vibrated
// TODO: [] - Add a toast notification when the alarm is labeled
// TODO: [] - Add a toast notification when the alarm is color coded
// TODO: [] - Add a toast notification when the alarm is time picked
// TODO: [] - Add a toast notification when the alarm is frequently used
// TODO: [] - Add a notification when the alarm goes off (expo-notifications, expo-task-manager, expo-background-fetch)
// TODO: [x] - Edit alarms
// TODO: [x] - Add sound to the alarm
// TDOO: [] - Block the deveice from usage for 10 minutes after the alarm goes off (in the morings only to prevent email-checking etc.(toggleable))
// TODO: [] - Deploy to expo.dev or vercel.app (what is the best option?)
// TODO: [] - Convert the clock screen to tailwindcss
// TODO: [] - Make use of the ios/android notification panel
// TODO: [] - Add try/catch and other error handling
// TODO: [] - Personalize the styling
// TODO: [] - Dark/Light mode
// TODO: [] - Add SQLite database to store Alarms
// TODO: [] - Add a snooze feature
// TODO: [] - Add a stop feature
// TODO: [] - Add a vibration feature
// TODO: [] - Add a snooze button
// TODO: [] - Add a stop button
// TODO: [] - Add a vibration button
// TODO: [] - Add a sound button
// TODO: [] - Add a label button
// TODO: [] - Add a color button (functionality for color coding the alarms)
// TODO: [] - Add a time picker
// TODO: [] - Add a frequently used alarms section(or a favorites section)
// TODO: [] - Color themes

// **** OPTIONAL TODOS ****
// TODO: [] - Add recurring alarms (e.g., weekdays, weekends)
// TODO: [] - Add multiple alarm profiles (e.g., workday alarm, weekend alarm)
// TODO: [] - Add a smart alarm (gradual wake-up)
// TODO: [] - Add a wake-up progress bar or countdown
// TODO: [] - Allow multiple alarms at the same time (e.g., primary and backup alarms)
// TODO: [] - Integrate weather data to adjust alarm settings based on weather conditions
// TODO: [] - Allow customizable snooze duration
// TODO: [] - Add location-based alarms (e.g., "Wake me up when I get home")
// TODO: [] - Add inspirational quotes or custom messages with alarms
// TODO: [] - Add a sleep timer feature with relaxing sounds/music
// TODO: [] - Add alarm backup and sync across devices
// TODO: [] - Implement smart detection (e.g., ambient sound, sleep cycle) to adjust alarm timing
// TODO: [] - Allow custom alarm ringtones from the music library
// TODO: [] - Allow alarm sound customization (e.g., frequency, tone, volume)
// TODO: [] - Override "Do Not Disturb" or "Silent Mode" for important alarmsimport '../global.css';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Toast from 'react-native-toast-message';
import { AlarmsProvider } from './context/AlarmsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FocusTimerProvider } from './context/FocusTimerContext';

function StackNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-alarm" options={{ presentation: 'modal' }} />
      </Stack>
      <Toast />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <FocusTimerProvider>
        <AlarmsProvider>
          <StackNavigator />
        </AlarmsProvider>
      </FocusTimerProvider>
    </ThemeProvider>
  );
}
