import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getThemedColors } from '@/theme/colors';

const Clock: React.FC<{ style?: object; textStyle?: object }> = ({
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();
  const colors = getThemedColors(isDarkMode);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <View className="flex items-center justify-center">
      <Text
        className="text-5xl font-bold"
        style={{ color: colors.text.primary }}
      >
        {formatted}
      </Text>
    </View>
  );
};

export default Clock;
