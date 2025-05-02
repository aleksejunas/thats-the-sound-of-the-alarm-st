import '../global.css';
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
