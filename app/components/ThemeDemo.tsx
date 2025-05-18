// ****** app/components/ThemeDemo.tsx ******

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const ThemeDemo = () => {
  const { colors, toggleTheme, isDarkMode, palette } = useTheme();

  const styles = useThemedStyles((colors) => ({
    container: {
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 8,
      borderColor: colors.border,
      borderWidth: 1,
    },
    cardContainer: {
      backgroundColor: colors.card,
      padding: 16,
      marginVertical: 8,
      borderRadius: 8,
    },
    title: {
      color: colors.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    text: {
      color: colors.text.secondary,
      marginBottom: 16,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    colorSwatch: {
      width: 40,
      height: 40,
      marginRight: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    colorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
  }));

  // We can use both the themed colors and raw palette colors
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dynamic Theme Demo</Text>

      <View style={styles.cardContainer}>
        <Text style={styles.text}>
          Current theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.title}>Color Palette</Text>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorSwatch, { backgroundColor: palette.primary }]}
          />
          <View
            style={[styles.colorSwatch, { backgroundColor: palette.lilac }]}
          />
          <View
            style={[styles.colorSwatch, { backgroundColor: palette.teaRose }]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: palette.skyMagenta1 },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default ThemeDemo;
