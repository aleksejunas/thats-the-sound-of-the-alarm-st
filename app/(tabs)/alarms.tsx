import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Alarm, getAlarms, saveAlarms, updateAlarm } from '../lib/storage';
import { registerAlarmTask, unregisterAlarmTask } from '../lib/taskManager';
export default function AlarmsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadAlarms();
    }, []),
  );

  const scheduleAlarms = async () => {
    try {
      alarms.forEach(async (alarm) => {
        if (alarm.enabled) {
          await registerAlarmTask(alarm);
        } else {
        await unregisterAlarmTask(alarm.id);
      }
      });
    } catch (error) {
  console.error('Failed to schedule alarms:', error);
}
  };

  const loadAlarms = async () => {
    try {
      const savedAlarms = await getAlarms();
      console.log('Loaded alarms in component:', savedAlarms); // Debug log
      setAlarms(savedAlarms);
    } catch (error) {
      console.error('Failed to load alarms:', error);
      // Maybe show an error message to the user
    }
  };

  const filteredAlarms = alarms.filter(
    (alarm) =>
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery),
  );

  const toggleAlarmSelection = useCallback((id: string) => {
    setSelectedAlarms((current) =>
      current.includes(id)
        ? current.filter((alarmId) => alarmId !== id)
        : [...current, id],
    );
  }, []);

  const deleteSelectedAlarms = useCallback(async () => {
    try {
      const updatedAlarms = alarms.filter(
        (alarm) => !selectedAlarms.includes(alarm.id),
      );
      await saveAlarms(updatedAlarms);
      setAlarms(updatedAlarms);
      setSelectedAlarms([]);
    } catch (error) {
      console.error('Failed to delete alarms:', error);
      // Maybe show an error message to the user
    }
  }, [selectedAlarms, alarms]);

  const toggleAlarm = useCallback(
    async (id: string) => {
      const alarm = alarms.find((a) => a.id === id);
      if (alarm) {
        const updatedAlarm = { ...alarm, enabled: !alarm.enabled };
        await updateAlarm(updatedAlarm);
        setAlarms((current) =>
          current.map((a) => (a.id === id ? updatedAlarm : a)),
        );
      }
    },
    [alarms],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 flex-row items-center  gap-3 pt-16 ">
        <TextInput
          className="flex-1 h-auto bg-surface rounded-lg px-3 text-text-primary border border-solid border-rounded border-gray-400 me-0.5 "
          placeholder="Search alarms..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {selectedAlarms.length > 0 ? (
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-surface p-2 rounded-lg"
            onPress={deleteSelectedAlarms}
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

      <ScrollView className="flex-1">
        {filteredAlarms.map((alarm) => (
          <TouchableOpacity
            key={alarm.id}
            className={`flex-row items-center p-4 border-b border-border ${
              selectedAlarms.includes(alarm.id) ? 'bg-surface' : ''
            }`}
            onLongPress={() => toggleAlarmSelection(alarm.id)}
            onPress={() =>
              selectedAlarms.length > 0
                ? toggleAlarmSelection(alarm.id)
                : toggleAlarm(alarm.id)
            }
          >
            <View className="flex-1">
              <Text className="text-2xl font-bold text-text-primary">
                {alarm.time}
              </Text>
              <Text className="text-base text-text-secondary mt-1">
                {alarm.label}
              </Text>
              <Text className="text-sm text-primary mt-1">
                {alarm.days.join(', ')}
              </Text>
            </View>
            <Switch
              value={alarm.enabled}
              onValueChange={() => toggleAlarm(alarm.id)}
              trackColor={{ false: '#333', true: '#60a5fa' }}
              thumbColor={alarm.enabled ? '#fff' : '#666'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
{
  /* </ScrollView> */
}
// </View>
// );
// }
