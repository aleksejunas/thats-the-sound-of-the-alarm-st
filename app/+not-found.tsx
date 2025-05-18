import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { getThemedColors } from '@/theme/colors';

export default function NotFoundScreen() {
  const { isDarkMode } = useTheme();
  const colors = getThemedColors(isDarkMode);
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View
        className="flex-1 items-center justify-center p-5"
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text
          className="text-xl font-bold"
          style={{ color: colors.text.primary }}
        >
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text style={{ color: colors.primary }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
