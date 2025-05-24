// TODO: [] - Add a snooze feature
// TODO: [] - Add a snooze button component
// TODO: [] - Add a shake to snooze functionality

import React from 'react';
import { View } from 'react-native';
import Clock from '../components/Clock';

const MainClockScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Clock />
    </View>
  );
};

export default MainClockScreen;
