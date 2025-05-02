import React from 'react';
import { Slot } from 'expo-router';
import SidebarLayout from '../components/SidebarLayout';

export default function TabLayout() {
  return (
    <SidebarLayout>
      <Slot />
    </SidebarLayout>
  );
}
