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
import { Plus, Trash2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAlarms } from '../context/AlarmsContext';
import { Alarm } from '../lib/storage';

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

  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [editedAlarm, setEditedAlarm] = useState<Partial<Alarm>>({});
  const isFocused = useIsFocused();

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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  // Helper function to render an alarm item
  const renderAlarmItem = ({ item }: { item: Alarm }) => {
    if (editingAlarmId === item.id) {
      return (
        <View className="p-4 border-b border-border bg-surface">
          <View className="flex-row items-center justify-between mb-3">
            <TextInput
              className="text-2xl font-bold text-text-primary bg-background p-2 rounded flex-1 mr-2"
              value={editedAlarm.time as string}
              onChangeText={(text) => setEditedAlarm({...editedAlarm, time: text})}
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
            />
            <Switch
              value={editedAlarm.enabled}
              onValueChange={(value) => setEditedAlarm({...editedAlarm, enabled: value})}
              trackColor={{ false: '#333', true: '#60a5fa' }}
              thumbColor={editedAlarm.enabled ? '#fff' : '#666'}
            />
          </View>
          
          <TextInput
            className="text-base text-text-secondary bg-background p-2 rounded mb-3"
            value={editedAlarm.label as string}
            onChangeText={(text) => setEditedAlarm({...editedAlarm, label: text})}
            placeholder="Alarm label"
          />
          
          <View className="flex-row flex-wrap gap-2 mb-3">
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                className={`px-3 py-1 rounded-full ${
                  editedAlarm.days?.includes(day) ? 'bg-primary' : 'bg-background'
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
                      : 'text-text-secondary'
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
          className={`flex-row items-center p-4 border-b border-border ${
            selectedAlarms.includes(item.id) ? 'bg-surface' : ''
          }`}
          onLongPress={() => toggleAlarmSelection(item.id)}
          onPress={() =>
            selectedAlarms.length > 0
              ? toggleAlarmSelection(item.id)
              : handleEditAlarm(item.id)
          }
        >
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">
              {item.time}
            </Text>
            <Text className="text-base text-text-secondary mt-1">
              {item.label}
            </Text>
            <Text className="text-sm text-primary mt-1">
              {item.days.join(', ')}
            </Text>
          </View>
          <Switch
            value={item.enabled}
            onValueChange={() => handleToggleAlarm(item.id)}
            trackColor={{ false: '#333', true: '#60a5fa' }}
            thumbColor={item.enabled ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 flex-row items-center gap-3 pt-16">
        <TextInput
          className="flex-1 h-auto bg-surface rounded-lg px-3 text-text-primary border border-solid border-rounded border-gray-400 me-0.5"
          placeholder="Search alarms..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {selectedAlarms.length > 0 ? (
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-surface p-2 rounded-lg"
            onPress={handleDeleteSelected}
          >
            <Trash2 color="#ef4444" size={24} />
            <Text className="text-red-500 font-semibold">
              Delete ({selectedAlarms.length})
            </Text>
          </TouchableOpacity>
        ) : (
          <Link href="/new-alarm" asChild>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center">
              <Plus color="#60a5fa" size={24} />
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {filteredAlarms.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-text-secondary text-lg text-center">
            No alarms found. Tap the + button to create a new alarm.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAlarms}
          renderItem={renderAlarmItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}