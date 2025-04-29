import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAlarms } from '../context/AlarmsContext';
import { Alarm } from '../lib/storage';

export default function AlarmsScreen() {
  const { alarms, isLoading, loadAlarms, toggleAlarm, deleteMultipleAlarms } =
    useAlarms();

  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
        : [...current, id],
    );
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleAlarms(selectedAlarms);
    setSelectedAlarms([]);
  };

  const handleToggleAlarm = async (id: string) => {
    await toggleAlarm(id);
  };

  const filteredAlarms = alarms.filter(
    (alarm) =>
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery),
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 flex-row items-center gap-3 pt-16">
        <TextInput
          // className="flex-1 h-auto bg-surface rounded-lg px-3 text-text-primary border border-solid border-rounded border-gray-400 me-0.5"
          className="flex-1 h-auto bg-pink-400 rounded-lg px-3 text-text-primary border border-solid border-rounded border-gray-400 me-0.5"
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
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center p-4 border-b border-border ${
                selectedAlarms.includes(item.id) ? 'bg-surface' : ''
              }`}
              onLongPress={() => toggleAlarmSelection(item.id)}
              onPress={() =>
                selectedAlarms.length > 0
                  ? toggleAlarmSelection(item.id)
                  : handleToggleAlarm(item.id)
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
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}
