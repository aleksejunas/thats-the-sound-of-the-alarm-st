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
import * as SystemUI from 'expo-system-ui';

function StackNavigator() {
  const { isDarkMode } = useTheme();
  const color = getThemedColors(isDarkMode);

  useEffect(() => {
    console.log('isDarkMode:', isDarkMode, 'background:', color.background);

    const configureNavigationBar = async () => {
      if (Platform.OS === 'android') {
        try {
          // Set navigation bar background color to pure black in dark mode
          await NavigationBar.setBackgroundColorAsync(
            isDarkMode ? '#000000' : color.background,
          );

          // Set navigation bar button style
          await NavigationBar.setButtonStyleAsync(
            isDarkMode ? 'light' : 'dark',
          );

          // Make navigation bar opaque
          await NavigationBar.setPositionAsync('absolute');

          console.log(
            'Navigation bar configured for',
            isDarkMode ? 'dark' : 'light',
            'mode',
          );
        } catch (error) {
          console.warn('Failed to configure navigation bar:', error);
        }
      }

      // TODO: Can this be a Switch instead?
      if (Platform.OS === 'ios') {
        try {
          await SystemUI.setBackgroundColorAsync(color.background);
        } catch (error) {
          console.warn('Failed to configure system UI:', error);
        }
      }
    };

    configureNavigationBar();
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
