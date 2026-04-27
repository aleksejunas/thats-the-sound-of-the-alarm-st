import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Clock from '../components/Clock';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThemedColors } from '../../theme/colors';
import ScreenHeader from '../components/ScreenHeader';

const MainClockScreen = () => {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const color = getThemedColors(isDarkMode);

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: color.background }}
    >
      <ScreenHeader title="Clock" subtitle="Current time and date" />
      <View className="flex-1 items-center justify-center">
        <Clock />
      </View>
    </View>
  );
};

export default MainClockScreen;
