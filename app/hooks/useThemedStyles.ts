// filepath: /home/rolf/Kode/Projects/ThatsTheSoundOfTheAlarm/ThatsTheSoundOfTheAlarmST/thats-the-sound-of-the-alarm-st/app/hooks/useThemedStyles.ts
import React from 'react';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { ThemeColors } from '../theme/colors';

// Type for style creator function that takes colors and returns styles
export type StyleCreator<T extends StyleSheet.NamedStyles<T>> = (
  colors: ThemeColors,
) => T;

// Hook to create and memoize themed styles
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleCreator: StyleCreator<T>,
): T {
  const { colors } = useTheme();

  // Memoize styles so they're only recalculated when colors change
  const styles = useMemo(() => {
    return StyleSheet.create(styleCreator(colors));
  }, [colors, styleCreator]);

  return styles;
}
