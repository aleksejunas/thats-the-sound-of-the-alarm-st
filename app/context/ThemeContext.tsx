// ***** app/context/ThemeContext.tsx *****

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemedColors, ThemeColors, colorPalette } from '../theme/colors';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  colors: ThemeColors;
  palette: typeof colorPalette;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    deviceColorScheme === 'dark',
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        }
        setIsInitialized(true);
      } catch (e) {
        console.error('Failed to load theme from storage:', e);
        setIsInitialized(true);
      }
    };

    loadTheme();
  }, []);

  // Set theme function
  const setTheme = useCallback(async (isDark: boolean) => {
    setIsDarkMode(isDark);
    try {
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme to storage:', e);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setTheme(!isDarkMode);
  }, [isDarkMode, setTheme]);

  // Generate themed colors based on current mode
  const colors = getThemedColors(isDarkMode);

  if (!isInitialized) {
    return null; // Wait until we've loaded theme preferences
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        setTheme,
        colors,
        palette: colorPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
