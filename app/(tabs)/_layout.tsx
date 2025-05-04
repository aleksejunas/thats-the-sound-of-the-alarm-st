import React from 'react';
import { Slot } from 'expo-router';
import DrawerLayout from '../components/SidebarLayout';

export default function TabLayout() {
  return (
    <DrawerLayout>
      <Slot />
    </DrawerLayout>
  );
}
