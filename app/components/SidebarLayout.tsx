import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { usePathname, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, List, Timer, Moon, Sun, Menu, X } from 'lucide-react-native';
import { useThemedStyles } from '../lib/styleUtils';

interface DrawerLayoutProps {
  children: React.ReactNode;
}

export default function DrawerLayout({ children }: DrawerLayoutProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnimation = React.useRef(new Animated.Value(-280)).current;
  const screenWidth = Dimensions.get('window').width;
  const styles = useThemedStyles();

  const drawerWidth = Math.min(280, screenWidth * 0.7); // Responsive drawer width

  // Toggle drawer
  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -drawerWidth,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const routes = [
    { icon: Clock, label: 'Alarms', path: '/alarms' },
    { icon: Timer, label: 'Focus Timer', path: '/focus' },
    { icon: List, label: 'Dashboard', path: '/' },
  ];

  const navigateTo = (path: string) => {
    if (path === '/alarms') {
      router.push('/alarms' as any);
    } else if (path === '/focus') {
      router.push('/focus' as any);
    } else if (path === '/') {
      router.push('/' as any);
    }
    toggleDrawer(); // Close drawer after navigation
  };

  return (
    <View className={`flex-1 ${styles.bgColor}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between ${styles.cardBgColor} border-b ${styles.borderColor} mt-6`}
        style={{
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={toggleDrawer}>
          <Menu color={styles.getIconColor()} size={24} />
        </TouchableOpacity>

        <Text className={`text-xl font-bold ${styles.textColor}`}>
          AlarmTracker
        </Text>

        <TouchableOpacity onPress={toggleTheme}>
          {isDarkMode ? (
            <Sun color={styles.getIconColor()} size={24} />
          ) : (
            <Moon color={styles.getIconColor()} size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* Drawer overlay */}
      {drawerOpen && (
        <Pressable
          className="absolute inset-0 bg-black bg-opacity-50 z-10"
          onPress={toggleDrawer}
          style={{ top: insets.top }}
        />
      )}

      {/* Drawer */}
      <Animated.View
        className={`absolute ${styles.surfaceColor} border-r ${styles.borderColor} z-20`}
        style={{
          width: drawerWidth,
          top: insets.top,
          bottom: 0,
          left: 0,
          transform: [{ translateX: drawerAnimation }],
        }}
      >
        <View
          className={`flex-row justify-between items-center p-4 border-b ${styles.borderColor}`}
        >
          <Text className={`text-lg font-bold ${styles.textColor}`}>Menu</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <X color={styles.getIconColor()} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {routes.map((route, index) => {
            const isActiveRoute = isActive(route.path);
            const IconComponent = route.icon;
            return (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center p-4 ${
                  isActiveRoute ? 'bg-primary bg-opacity-10' : ''
                }`}
                onPress={() => navigateTo(route.path)}
              >
                <IconComponent
                  size={20}
                  color={
                    isActiveRoute
                      ? '#4f46e5'
                      : isDarkMode
                      ? '#f8fafc' // Lighter color in dark mode for better contrast
                      : '#0f172a' // Darker color in light mode for better contrast
                  }
                />
                <Text
                  className={`ml-3 ${
                    isActiveRoute ? 'text-primary font-medium' : ''
                  }`}
                  style={{
                    color: isActiveRoute
                      ? '#4f46e5'
                      : isDarkMode
                      ? '#f8fafc' // Lighter color in dark mode
                      : '#0f172a', // Darker color in light mode
                  }}
                >
                  {route.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Theme switch in drawer footer */}
        <TouchableOpacity
          className={`flex-row items-center p-4 border-t ${styles.borderColor}`}
          onPress={toggleTheme}
        >
          {isDarkMode ? (
            <>
              <Sun size={20} color="#f8fafc" />
              <Text className="ml-3 text-light-text-primary">Light Mode</Text>
            </>
          ) : (
            <>
              <Moon size={20} color="#0f172a" />
              <Text className="ml-3 text-dark-background">Dark Mode</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
