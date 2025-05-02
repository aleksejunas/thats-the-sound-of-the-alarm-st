import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, List, Timer, Moon, Sun } from 'lucide-react-native';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const bgColor = isDarkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const textColor = isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';
  const mainBgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';

  const isActive = (path: string) => {
    return pathname === path;
  };

  const routes = [
    { icon: Clock, label: 'Alarms', path: '/alarms' },
    { icon: Timer, label: 'Focus Timer', path: '/focus' },
    { icon: List, label: 'Dashboard', path: '/' },
  ];

  return (
    <View className={`flex-1 flex-row ${mainBgColor}`}>
      {/* Sidebar */}
      <View className={`w-64 ${bgColor} border-r ${borderColor}`} style={{ paddingTop: insets.top }}>
        {/* App Name */}
        <View className={`p-4 border-b ${borderColor}`}>
          <Text className={`text-xl font-bold ${textColor}`}>AlarmTracker</Text>
          <Text className={`text-sm ${secondaryTextColor}`}>Sleep well, wake better</Text>
        </View>

        {/* Navigation Menu */}
        <ScrollView className="flex-1">
          {routes.map((route, index) => {
            const isActiveRoute = isActive(route.path);
            const IconComponent = route.icon;
            return (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center p-4 ${isActiveRoute ? 'bg-primary bg-opacity-10' : ''}`}
                onPress={() => {
                  router.push(route.path);
                }}
              >
                <IconComponent
                  size={20}
                  color={isActiveRoute ? '#4f46e5' : isDarkMode ? '#cbd5e1' : '#64748b'}
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

        {/* Theme Switch */}
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
      </View>

      {/* Main Content Area */}
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {children}
      </View>
    </View>
  );
}