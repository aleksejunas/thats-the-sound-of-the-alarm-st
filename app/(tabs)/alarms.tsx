import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Plus, Trash2, Clock, CheckSquare, MoreVertical, Edit, ChevronDown } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAlarms } from '../context/AlarmsContext';
import { useTheme } from '../context/ThemeContext';
import { Alarm } from '../lib/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [editedAlarm, setEditedAlarm] = useState<Partial<Alarm>>({});
  const isFocused = useIsFocused();

  // Theme-based styles
  const textColor = isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-background' : 'bg-light-background';
  const cardBgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const cardHighlightColor = isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';

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
        : [...current, id]
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
          'Please enter a valid time in 24-hour format (HH:MM)'
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
      alarm.time.includes(searchQuery)
  );

  // Group alarms by priority (enabled ones first)
  const priorityAlarms = filteredAlarms.filter(alarm => alarm.enabled);
  const otherAlarms = filteredAlarms.filter(alarm => !alarm.enabled);

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // Helper function to render an alarm item
  const renderAlarmItem = ({ item }: { item: Alarm }) => {
    if (editingAlarmId === item.id) {
      return (
        <View className={`p-4 border ${borderColor} rounded-lg mb-3 ${cardBgColor}`}>
          <View className="flex-row items-center justify-between mb-3">
            <TextInput
              className={`text-2xl font-bold ${textColor} bg-opacity-10 border ${borderColor} rounded p-2 flex-1 mr-2`}
              value={editedAlarm.time as string}
              onChangeText={(text) => setEditedAlarm({...editedAlarm, time: text})}
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
              placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
            />
            <Switch
              value={editedAlarm.enabled}
              onValueChange={(value) => setEditedAlarm({...editedAlarm, enabled: value})}
              trackColor={{ false: isDarkMode ? '#334155' : '#e2e8f0', true: '#4f46e5' }}
              thumbColor={editedAlarm.enabled ? '#ffffff' : isDarkMode ? '#1e293b' : '#ffffff'}
            />
          </View>
          
          <TextInput
            className={`${secondaryTextColor} border ${borderColor} rounded p-2 mb-3`}
            value={editedAlarm.label as string}
            onChangeText={(text) => setEditedAlarm({...editedAlarm, label: text})}
            placeholder="Alarm label"
            placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
          />
          
          <View className="flex-row flex-wrap gap-2 mb-3">
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                className={`px-3 py-1 rounded-full ${
                  editedAlarm.days?.includes(day) ? 'bg-primary' : isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'
                }`}
                onPress={() => {
                  const currentDays = editedAlarm.days || [];
                  const newDays = currentDays.includes(day)
                    ? currentDays.filter(d => d !== day)
                    : [...currentDays, day];
                  setEditedAlarm({...editedAlarm, days: newDays});
                }}
              >
                <Text
                  className={`text-xs font-semibold ${
                    editedAlarm.days?.includes(day)
                      ? 'text-white'
                      : secondaryTextColor
                  }`}
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
          className={`flex-row items-center p-4 border ${borderColor} rounded-lg mb-3 ${item.enabled ? cardBgColor : cardHighlightColor}`}
          onLongPress={() => toggleAlarmSelection(item.id)}
          onPress={() =>
            selectedAlarms.length > 0
              ? toggleAlarmSelection(item.id)
              : handleEditAlarm(item.id)
          }
          activeOpacity={0.7}
        >
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${textColor}`}>
              {item.time}
            </Text>
            <Text className={`text-base ${secondaryTextColor} mt-1`}>
              {item.label}
            </Text>
            {item.days.length > 0 && (
              <View className="flex-row flex-wrap mt-2">
                {item.days.map((day) => (
                  <View key={day} className="bg-primary bg-opacity-20 px-2 py-0.5 rounded mr-1 mb-1">
                    <Text className="text-xs text-primary font-medium">{day}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View className="flex-row items-center">
            <Switch
              value={item.enabled}
              onValueChange={() => handleToggleAlarm(item.id)}
              trackColor={{ false: isDarkMode ? '#334155' : '#e2e8f0', true: '#4f46e5' }}
              thumbColor={item.enabled ? '#ffffff' : isDarkMode ? '#1e293b' : '#ffffff'}
              style={{ marginRight: 8 }}
            />
            <TouchableOpacity 
              className="p-2"
              onPress={() => handleEditAlarm(item.id)}
            >
              <Edit size={18} color={isDarkMode ? "#cbd5e1" : "#64748b"} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className={`flex-1 ${bgColor}`}>
      <View className="p-4 border-b ${borderColor}">
        <Text className={`text-2xl font-bold ${textColor}`}>Alarms</Text>
        <Text className={`${secondaryTextColor}`}>
          Manage your wake-up times and reminders
        </Text>
      </View>

      <View className="p-4">
        <View className="flex-row items-center justify-between mb-4">
          <TextInput
            className={`flex-1 border ${borderColor} rounded-lg px-3 py-2 ${textColor} mr-2`}
            placeholder="Search alarms..."
            placeholderTextColor={isDarkMode ? "#64748b" : "#94a3b8"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
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

        {priorityAlarms.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Clock size={16} color={isDarkMode ? "#cbd5e1" : "#64748b"} />
              <Text className={`ml-2 font-medium ${textColor}`}>Active Alarms</Text>
            </View>
            {priorityAlarms.map(alarm => (
              <View key={alarm.id}>
                {renderAlarmItem({ item: alarm })}
              </View>
            ))}
          </View>
        )}

        {otherAlarms.length > 0 && (
          <View>
            <View className="flex-row items-center mb-2">
              <Clock size={16} color={isDarkMode ? "#cbd5e1" : "#64748b"} />
              <Text className={`ml-2 font-medium ${textColor}`}>Inactive Alarms</Text>
            </View>
            {otherAlarms.map(alarm => (
              <View key={alarm.id}>
                {renderAlarmItem({ item: alarm })}
              </View>
            ))}
          </View>
        )}

        {filteredAlarms.length === 0 && (
          <View className="flex-1 items-center justify-center py-10">
            <Clock size={48} color={isDarkMode ? "#334155" : "#e2e8f0"} />
            <Text className={`mt-4 text-center text-lg ${secondaryTextColor}`}>
              No alarms found. Tap the + button to create a new alarm.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}