import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Moon,
  Sun,
  Volume2,
  Vibrate,
  Bell,
  Smartphone,
  Info,
  Trash2,
  Download,
  Upload,
} from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';
import { useAlarms } from './context/AlarmsContext';
import { getThemedColors } from '../theme/colors';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { alarms, deleteMultipleAlarms } = useAlarms();
  const colors = getThemedColors(isDarkMode);
  const router = useRouter();

  // Settings state
  const [defaultVolume, setDefaultVolume] = useState(true);
  const [defaultVibration, setDefaultVibration] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(true);

  const handleDeleteAllAlarms = () => {
    Alert.alert(
      'Delete All Alarms',
      'Are you sure you want to delete all alarms? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const allAlarmIds = alarms.map((alarm) => alarm.id);
            await deleteMultipleAlarms(allAlarmIds);
            Alert.alert('Success', 'All alarms have been deleted.');
          },
        },
      ]
    );
  };

  const handleExportAlarms = () => {
    // TODO: Implement export functionality
    Alert.alert('Export Alarms', 'Export functionality coming soon!');
  };

  const handleImportAlarms = () => {
    // TODO: Implement import functionality
    Alert.alert('Import Alarms', 'Import functionality coming soon!');
  };

  const SettingsSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6">
      <Text
        className="text-sm font-semibold uppercase tracking-wide mb-3 px-4"
        style={{ color: colors.text.muted }}
      >
        {title}
      </Text>
      <View
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    rightElement,
    onPress,
    showBorder = true,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center p-4 ${showBorder ? 'border-b' : ''}`}
      style={{ borderColor: colors.border }}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Text
          className="text-base font-medium"
          style={{ color: colors.text.primary }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm mt-1" style={{ color: colors.text.muted }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <View
        className="flex-1"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Appearance */}
            <SettingsSection title="Appearance">
              <SettingsItem
                icon={
                  isDarkMode ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Sun size={20} color={colors.primary} />
                  )
                }
                title="Dark Mode"
                subtitle={
                  isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'
                }
                rightElement={
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={isDarkMode ? colors.surface : '#f4f3f4'}
                  />
                }
                showBorder={false}
              />
            </SettingsSection>

            {/* Default Alarm Settings */}
            <SettingsSection title="Default Alarm Settings">
              <SettingsItem
                icon={<Volume2 size={20} color={colors.primary} />}
                title="Sound"
                subtitle="Enable sound for new alarms by default"
                rightElement={
                  <Switch
                    value={defaultVolume}
                    onValueChange={setDefaultVolume}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={defaultVolume ? colors.surface : '#f4f3f4'}
                  />
                }
              />
              <SettingsItem
                icon={<Vibrate size={20} color={colors.primary} />}
                title="Vibration"
                subtitle="Enable vibration for new alarms by default"
                rightElement={
                  <Switch
                    value={defaultVibration}
                    onValueChange={setDefaultVibration}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={defaultVibration ? colors.surface : '#f4f3f4'}
                  />
                }
                showBorder={false}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications">
              <SettingsItem
                icon={<Bell size={20} color={colors.primary} />}
                title="Push Notifications"
                subtitle="Receive notifications when alarms go off"
                rightElement={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={
                      notificationsEnabled ? colors.surface : '#f4f3f4'
                    }
                  />
                }
              />
              <SettingsItem
                icon={<Smartphone size={20} color={colors.primary} />}
                title="Background Mode"
                subtitle="Keep alarms active when app is closed"
                rightElement={
                  <Switch
                    value={backgroundMode}
                    onValueChange={setBackgroundMode}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={backgroundMode ? colors.surface : '#f4f3f4'}
                  />
                }
                showBorder={false}
              />
            </SettingsSection>

            {/* Data Management */}
            <SettingsSection title="Data Management">
              <SettingsItem
                icon={<Upload size={20} color={colors.primary} />}
                title="Export Alarms"
                subtitle="Save alarms to file"
                onPress={handleExportAlarms}
              />
              <SettingsItem
                icon={<Download size={20} color={colors.primary} />}
                title="Import Alarms"
                subtitle="Load alarms from file"
                onPress={handleImportAlarms}
              />
              <SettingsItem
                icon={<Trash2 size={20} color="#ef4444" />}
                title="Delete All Alarms"
                subtitle="Remove all saved alarms"
                onPress={handleDeleteAllAlarms}
                showBorder={false}
              />
            </SettingsSection>

            {/* About */}
            <SettingsSection title="About">
              <SettingsItem
                icon={<Info size={20} color={colors.primary} />}
                title="App Version"
                subtitle="1.0.0"
                onPress={() =>
                  Alert.alert(
                    'About',
                    'ThatsTheSoundOfTheAlarm v1.0.0\n\nA customizable alarm clock app.'
                  )
                }
                showBorder={false}
              />
            </SettingsSection>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}
