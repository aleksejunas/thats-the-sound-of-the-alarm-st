import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { getThemedColors } from '../../theme/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showSettingsButton?: boolean;
  rightComponent?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showSettingsButton = false, // Changed default to false
  rightComponent,
}) => {
  const { isDarkMode } = useTheme();
  const colors = getThemedColors(isDarkMode);

  return (
    <View
      className="p-4 border-b flex-row items-center justify-between"
      style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
    >
      <View className="flex-1">
        <Text
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ color: colors.text.secondary }}>{subtitle}</Text>
        )}
      </View>

      <View className="flex-row items-center">
        {rightComponent}

        {showSettingsButton && (
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            className="w-10 h-10 rounded-full items-center justify-center ml-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Settings size={20} color={colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ScreenHeader;
