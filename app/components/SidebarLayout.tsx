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

  // Theme-based styles
  const textColor = isDarkMode
    ? 'text-dark-text-primary'
    : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode
    ? 'text-dark-text-secondary'
    : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';
  const cardBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const drawerBgColor = isDarkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const headerBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';

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
    <View className={`flex-1 ${bgColor}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between ${headerBgColor} border-b ${borderColor} mt-6`}
        style={{
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={toggleDrawer}>
          <Menu color={isDarkMode ? '#cbd5e1' : '#64748b'} size={24} />
        </TouchableOpacity>

        <Text className={`text-xl font-bold ${textColor}`}>AlarmTracker</Text>

        <TouchableOpacity onPress={toggleTheme}>
          {isDarkMode ? (
            <Sun color={'#cbd5e1'} size={24} />
          ) : (
            <Moon color={'#64748b'} size={24} />
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
        className={`absolute ${drawerBgColor} border-r ${borderColor} z-20`}
        style={{
          width: drawerWidth,
          top: insets.top,
          bottom: 0,
          left: 0,
          transform: [{ translateX: drawerAnimation }],
        }}
      >
        <View className="flex-row justify-between items-center p-4 border-b ${borderColor}">
          <Text className={`text-lg font-bold ${textColor}`}>Menu</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <X color={isDarkMode ? '#cbd5e1' : '#64748b'} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {routes.map((route, index) => {
            const isActiveRoute = isActive(route.path);
            const IconComponent = route.icon;
            return (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center p-4 ${isActiveRoute ? 'bg-primary bg-opacity-10' : ''}`}
                onPress={() => navigateTo(route.path)}
              >
                <IconComponent
                  size={20}
                  color={
                    isActiveRoute
                      ? '#4f46e5'
                      : isDarkMode
                        ? '#cbd5e1'
                        : '#64748b'
                  }
                />
                <Text
                  className={`ml-3 ${isActiveRoute ? 'text-primary font-medium' : secondaryTextColor}`}
                >
                  {route.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Theme switch in drawer footer */}
        <TouchableOpacity
          className={`flex-row items-center p-4 border-t ${borderColor}`}
          onPress={toggleTheme}
        >
          {isDarkMode ? (
            <>
              <Sun size={20} color="#cbd5e1" />
              <Text className="ml-3 text-dark-text-secondary">Light Mode</Text>
            </>
          ) : (
            <>
              <Moon size={20} color="#64748b" />
              <Text className="ml-3 text-light-text-secondary">Dark Mode</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content Area */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
