import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Plus,
  Trash2,
  Clock,
  // CheckSquare,
  Edit,
  // WindArrowDown,
  Settings,
  Icon,
} from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAlarms } from '../context/AlarmsContext';
import { useTheme } from '../context/ThemeContext';
import { Alarm } from '../../lib/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThemedColors } from '@/theme/colors';
import { useNavigation } from '@react-navigation/native';

// Same days array as in new-alarm.tsx
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AlarmsScreen() {
  const {
    alarms,
    isLoading,
    loadAlarms,
    toggleAlarm,
    deleteMultipleAlarms,
    updateAlarm,
  } = useAlarms();
  const { isDarkMode } = useTheme();
  const colors = getThemedColors(isDarkMode);
  const navigation = useNavigation();

  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [editedAlarm, setEditedAlarm] = useState<Partial<Alarm>>({});
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  // Reload alarms when the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      loadAlarms();
    }
  }, [isFocused, loadAlarms]);

  const toggleAlarmSelection = (id: string) => {
    setSelectedAlarms((current) =>
      current.includes(id)
        ? current.filter((alarmId) => alarmId !== id)
        : [...current, id],
    );
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleAlarms(selectedAlarms);
    setSelectedAlarms([]);
  };

  const handleEditAlarm = (id: string) => {
    const alarmToEdit = alarms.find((alarm) => alarm.id === id);
    if (alarmToEdit) {
      setEditingAlarmId(id);
      setEditedAlarm({ ...alarmToEdit });
      console.log('Editing alarm:', alarmToEdit);
    }
  };

  const validateTime = (timeString: string): boolean => {
    // Simple regex for 24-hour time format (00:00 to 23:59)
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(timeString);
  };

  const handleSaveEditedAlarm = async () => {
    if (editingAlarmId && Object.keys(editedAlarm).length > 0) {
      // Validate time format if it was edited
      if (editedAlarm.time && !validateTime(editedAlarm.time)) {
        Alert.alert(
          'Invalid Time',
          'Please enter a valid time in 24-hour format (HH:MM)',
        );
        return;
      }

      console.log('Saving edited alarm:', editedAlarm);
      await updateAlarm(editingAlarmId, editedAlarm);
      setEditingAlarmId(null);
      setEditedAlarm({});
    }
  };

  const handleToggleAlarm = async (id: string) => {
    await toggleAlarm(id);
  };

  const filteredAlarms = alarms.filter(
    (alarm) =>
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery),
  );

  // Group alarms by priority (enabled ones first)
  const priorityAlarms = filteredAlarms.filter((alarm) => alarm.enabled);
  const otherAlarms = filteredAlarms.filter((alarm) => !alarm.enabled);

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Helper function to render an alarm item
  const renderAlarmItem = ({ item }: { item: Alarm }) => {
    if (editingAlarmId === item.id) {
      return (
        <View
          className="p-4 border rounded-lg mb-3"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <TextInput
              className="text-2xl font-bold bg-opacity-10 border rounded p-2 flex-1 mr-2"
              value={editedAlarm.time as string}
              onChangeText={(text) =>
                setEditedAlarm({ ...editedAlarm, time: text })
              }
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
              placeholderTextColor={colors.text.muted}
              style={{
                color: colors.text.primary,
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            />
            <Switch
              value={editedAlarm.enabled}
              onValueChange={(value) =>
                setEditedAlarm({ ...editedAlarm, enabled: value })
              }
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                editedAlarm.enabled
                  ? // TODO: use colors variables
                    '#ffffff'
                  : isDarkMode
                    ? colors.surface
                    : '#ffffff'
              }
            />
          </View>

          <TextInput
            className="border rounded p-2 mb-3"
            value={editedAlarm.label as string}
            onChangeText={(text) =>
              setEditedAlarm({ ...editedAlarm, label: text })
            }
            placeholder="Alarm label"
            placeholderTextColor={colors.text.muted}
            style={{
              color: colors.text.secondary,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          />

          {/* Edited Alarms  */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: editedAlarm.days?.includes(day)
                    ? colors.text.primary
                    : colors.button.background,
                }}
                onPress={() => {
                  const currentDays = editedAlarm.days || [];
                  const newDays = currentDays.includes(day)
                    ? currentDays.filter((d) => d !== day)
                    : [...currentDays, day];
                  setEditedAlarm({ ...editedAlarm, days: newDays });
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color: editedAlarm.days?.includes(day)
                      ? // ? '#fff'
                        colors.button.background
                      : colors.text.primary,
                  }}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-end gap-2">
            <TouchableOpacity
              className="bg-gray-500 px-4 py-2 rounded-lg"
              onPress={() => {
                setEditingAlarmId(null);
                setEditedAlarm({});
              }}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-lg"
              onPress={handleSaveEditedAlarm}
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          className="flex-row items-center p-4 border rounded-lg mb-3"
          style={{
            backgroundColor: selectedAlarms.includes(item.id)
              ? colors.cardHighlight
              : item.enabled
                ? colors.card
                : colors.cardHighlight,
            borderColor: selectedAlarms.includes(item.id)
              ? colors.primary
              : colors.border,
            borderWidth: selectedAlarms.includes(item.id) ? 2 : 1,
            shadowColor: selectedAlarms.includes(item.id)
              ? colors.primary
              : '#000',
            shadowOffset: selectedAlarms.includes(item.id)
              ? { width: 0, height: 4 }
              : { width: 0, height: 2 },
            shadowOpacity: selectedAlarms.includes(item.id) ? 0.3 : 0.1,
            shadowRadius: selectedAlarms.includes(item.id) ? 8 : 2,
            elevation: selectedAlarms.includes(item.id) ? 8 : 2,
            transform: selectedAlarms.includes(item.id)
              ? [{ scale: 0.97 }]
              : [],
          }}
          onLongPress={() => toggleAlarmSelection(item.id)}
          onPress={() =>
            selectedAlarms.length > 0
              ? toggleAlarmSelection(item.id)
              : handleEditAlarm(item.id)
          }
          activeOpacity={0.7}
        >
          <View className="flex-1">
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {item.time}
            </Text>
            <Text
              className="text-base mt-1"
              style={{ color: colors.text.secondary }}
            >
              {item.label}
            </Text>
            {item.days.length > 0 && (
              <View className="flex-row flex-wrap mt-2">
                {item.days.map((day) => (
                  <View
                    key={day}
                    className="px-2 py-0.5 rounded mr-1 mb-1"
                    style={{ backgroundColor: colors.background }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View className="flex-row items-center">
            <Switch
              value={item.enabled}
              onValueChange={() => handleToggleAlarm(item.id)}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                item.enabled
                  ? '#ffffff'
                  : isDarkMode
                    ? colors.surface
                    : '#ffffff'
              }
              style={{ marginRight: 8 }}
            />
            <TouchableOpacity
              className="p-2"
              onPress={() => handleEditAlarm(item.id)}
            >
              <Edit size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: colors.background }}
    >
      <View className="p-4">
        {/* Header with search, settings, and actions */}
        <View className="flex-row items-center mb-4">
          <TextInput
            className="flex-1 border rounded-lg px-3 py-2 mr-2"
            placeholder="Search alarms..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              color: colors.text.primary,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          />

          {/* Settings button - always visible */}
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            className="w-10 h-10 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Settings size={20} color={colors.text.primary} />
          </TouchableOpacity>

          {selectedAlarms.length > 0 ? (
            <TouchableOpacity
              className="bg-error px-3 py-2 rounded-lg flex-row items-center"
              onPress={handleDeleteSelected}
            >
              <Trash2 color="#ffffff" size={16} />
              <Text className="text-white font-semibold ml-1">
                Delete ({selectedAlarms.length})
              </Text>
            </TouchableOpacity>
          ) : (
            <Link href="/new-alarm" asChild>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <Plus color="#ffffff" size={20} />
              </TouchableOpacity>
            </Link>
          )}
        </View>

        <FlatList
          data={[...priorityAlarms, ...otherAlarms]}
          keyExtractor={(item) => item.id}
          renderItem={renderAlarmItem}
          ListHeaderComponent={
            <>
              {priorityAlarms.length > 0 && (
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Clock size={16} color={colors.text.muted} />
                    <Text
                      className="ml-2 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Active Alarms
                    </Text>
                  </View>
                </View>
              )}
              {otherAlarms.length > 0 && (
                <View>
                  <View className="flex-row items-center mb-2">
                    <Clock size={16} color={colors.text.muted} />
                    <Text
                      className="ml-2 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Inactive Alarms
                    </Text>
                  </View>
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Clock size={48} color={colors.cardHighlight} />
              <Text
                className="mt-4 text-center text-lg"
                style={{ color: colors.text.secondary }}
              >
                No alarms found. Tap the + button to create a new alarm.
              </Text>
            </View>
          }
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        />
      </View>
    </View>
  );
}
