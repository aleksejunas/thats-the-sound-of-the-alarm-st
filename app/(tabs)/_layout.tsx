import React from 'react';
import { Platform } from 'react-native';
import { Clock, List, Timer } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import DrawerLayout from '../components/SidebarLayout';

export default function TabLayout() {
  // On web, wrap with DrawerLayout; on mobile, use regular tabs
  if (Platform.OS === 'web') {
    return (
      <DrawerLayout>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="alarms" />
          <Tabs.Screen name="focus" />
          <Tabs.Screen name="main-clock" />
        </Tabs>
      </DrawerLayout>
    );
  }

  // Mobile: regular tab navigation
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <List size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          title: 'Alarms',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color }) => <Timer size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="main-clock"
        options={{
          title: 'Clock',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
