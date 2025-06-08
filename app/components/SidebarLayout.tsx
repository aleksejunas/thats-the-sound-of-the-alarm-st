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
import { getThemedColors } from '../../theme/colors';
// import { useThemedStyles } from '../../lib/styleUtils';

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
  // const styles = useThemedStyles();
  // Import themed colors
  // const { getThemedColors } = require('../../theme/colors');
  // const { isDarkMode };
  const colors = getThemedColors(isDarkMode);

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
    { icon: Clock, label: 'Clock', path: '/main-clock' },
    { icon: Clock, label: 'Alarms', path: '/alarms' },
    { icon: Timer, label: 'Focus Timer', path: '/focus' },
    { icon: List, label: 'Dashboard', path: '/' },
  ];

  const navigateTo = (path: string) => {
    console.log('Navigating to:', path);
    router.push(path as any);
    toggleDrawer(); // Close drawer after navigation
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between mt-6"
        style={{
          backgroundColor: colors.card,
          borderRightColor: colors.border,
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={toggleDrawer}>
          <Menu color={colors.text.primary} size={24} />
        </TouchableOpacity>

        <Text
          className="text-xl font-bold"
          style={{ color: colors.text.primary }}
        >
          AlarmTracker
        </Text>

        <TouchableOpacity onPress={toggleTheme}>
          {isDarkMode ? (
            <Sun color={colors.text.primary} size={24} />
          ) : (
            <Moon color={colors.text.primary} size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* Drawer overlay */}
      {drawerOpen && (
        <Pressable
          className="absolute inset-0 z-10"
          onPress={toggleDrawer}
          style={{
            top: insets.top,
            backgroundColor: 'rgba(0,0,0,0.3)',
            position: 'absolute',
          }}
        />
      )}

      {/* Drawer */}
      <Animated.View
        // className={`absolute ${styles.surfaceColor} border-r ${styles.borderColor} z-20`}
        className="absolute  border-r  z-20"
        style={{
          width: drawerWidth,
          top: insets.top,
          bottom: 0,
          left: 0,
          transform: [{ translateX: drawerAnimation }],
          backgroundColor: colors.surface,
          borderRightColor: colors.border,
        }}
      >
        <View
          className="flex-row justify-between items-center p-4 border-b"
          style={{
            borderBottomColor: colors.border,
          }}
        >
          <Text
            className="text-lg font-bold"
            style={{ color: colors.text.primary }}
          >
            Menu
          </Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <X color={colors.text.primary} size={20} />
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
                  isActiveRoute ? 'rounded.md' : ''
                }`}
                onPress={() => navigateTo(route.path)}
                style={{
                  backgroundColor: isActiveRoute
                    ? `${colors.primaryLight}22`
                    : undefined,
                  marginHorizontal: isActiveRoute ? 4 : 0,
                }}
              >
                <IconComponent
                  size={20}
                  color={
                    isActiveRoute ? colors.primaryLight : colors.text.primary
                  }
                />
                <Text
                  className={`ml-3 ${isActiveRoute ? 'font-medium' : ''}`}
                  style={{
                    color: isActiveRoute
                      ? colors.primaryLight
                      : colors.text.primary,
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
          className="flex-row items-center p-4 border-t"
          onPress={toggleTheme}
          style={{
            borderTopColor: colors.border,
          }}
        >
          {isDarkMode ? (
            <>
              <Sun size={20} color={colors.text.primary} />
              <Text className="ml-3" style={{ color: colors.text.primary }}>
                Light Mode
              </Text>
            </>
          ) : (
            <>
              <Moon size={20} color={colors.text.primary} />
              <Text className="ml-3" style={{ color: colors.text.primary }}>
                Dark Mode
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <View className="flex-1" style={{ zIndex: 5 }}>
        {children}
      </View>
    </View>
  );
}
