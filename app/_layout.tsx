import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Toast from 'react-native-toast-message';
import { AlarmsProvider } from './context/AlarmsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <AlarmsProvider>
        {' '}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
          <Toast />
        </Stack>
        <StatusBar style="auto" />
      </AlarmsProvider>
    </>
  );
}
