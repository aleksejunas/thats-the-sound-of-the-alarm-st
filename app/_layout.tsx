import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Toast from 'react-native-toast-message';
import { AlarmsProvider } from './context/AlarmsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FocusTimerProvider } from './context/FocusTimerContext';
import '../global.css';
import { getThemedColors } from '@/theme/colors';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as NavigationBar from 'expo-navigation-bar';

function StackNavigator() {
  const { isDarkMode } = useTheme();
  const color = getThemedColors(isDarkMode);

  useEffect(() => {
    // Configure navigation bar to match the theme
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(color.background);
      NavigationBar.setButtonStyleAsync(isDarkMode ? 'light' : 'dark');
    }
  }, [isDarkMode, color.background]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-alarm" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            title: 'Settings',
            headerShown: true, // Show the header with a close button
          }}
        />
      </Stack>
      <Toast />
      <StatusBar
        style={isDarkMode ? 'light' : 'dark'}
        backgroundColor={color.background}
      />
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
