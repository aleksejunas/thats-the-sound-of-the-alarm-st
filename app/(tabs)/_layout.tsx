// TODO: [x] - Update the alarm screen after adding a new alarm
// TODO: [] - Add a notification when the alarm goes off (expo-notifications, expo-task-manager, expo-background-fetch)
// TODO: [] - Edit alarms
// TODO: [] - Add sound to the alarm
// TODO: [] - Deploy to expo.dev or vercel.app (what is the best option?)
// TODO: [] - Convert the clock screen to tailwindcss
// TODO: [] - Make use of the ios/android notification panel
// TODO: [] - Add try/catch and other error handling
// TODO: [] - Personalize the styling
// TODO: [] - Dark/Light mode
// TODO: [] - Add SQLite database to store Alarms
// TODO: [] - Add a snooze feature
// TODO: [] - Add a stop feature
// TODO: [] - Add a vibration feature
// TODO: [] - Add a snooze button
// TODO: [] - Add a stop button
// TODO: [] - Add a vibration button
// TODO: [] - Add a sound button
// TODO: [] - Add a label button
// TODO: [] - Add a color button (functionality for color coding the alarms)
// TODO: [] - Add a time picker
// TODO: [] - Add a frequently used alarms section(or a favorites section)
// TODO: [] - Color themes

// **** OPTIONAL TODOS ****
// TODO: [] - Add recurring alarms (e.g., weekdays, weekends)
// TODO: [] - Add multiple alarm profiles (e.g., workday alarm, weekend alarm)
// TODO: [] - Add a smart alarm (gradual wake-up)
// TODO: [] - Add a wake-up progress bar or countdown
// TODO: [] - Allow multiple alarms at the same time (e.g., primary and backup alarms)
// TODO: [] - Integrate weather data to adjust alarm settings based on weather conditions
// TODO: [] - Allow customizable snooze duration
// TODO: [] - Add location-based alarms (e.g., "Wake me up when I get home")
// TODO: [] - Add inspirational quotes or custom messages with alarms
// TODO: [] - Add a sleep timer feature with relaxing sounds/music
// TODO: [] - Add alarm backup and sync across devices
// TODO: [] - Implement smart detection (e.g., ambient sound, sleep cycle) to adjust alarm timing
// TODO: [] - Allow custom alarm ringtones from the music library
// TODO: [] - Allow alarm sound customization (e.g., frequency, tone, volume)
// TODO: [] - Override "Do Not Disturb" or "Silent Mode" for important alarms

import React from 'react';
import { Tabs } from 'expo-router';
import { Clock, Bell } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#60a5fa',
        // tabBarActiveTintColor: 'orange',

        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clock',
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alarms"
        options={{
          title: 'Alarms',
          tabBarIcon: ({ size, color }) => <Bell size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
