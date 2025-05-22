import React from 'react';
import { View, Text } from 'react-native';
import Clock from '../components/Clock';

const MainClockScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Clock />
    </View>
  );
};

export default MainClockScreen;
