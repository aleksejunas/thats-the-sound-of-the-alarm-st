import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Award, Plus, Trash2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Alarm, getAlarms, saveAlarms } from '../lib/storage';
import TaskManager from '../lib/taskManager';
import { useIsFocused } from '@react-navigation/native';

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [selectedAlarms, setSelectedAlarms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  const createAlarm = useCallback(
    async (newAlarm: Alarm) => {
      try {
        const updatedAlarms = [...alarms, newAlarm];
        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);

        Toast.show({
          type: 'success',
          text1: 'Alarm Created',
          text2: `Alarm "${newAlarm.label}" has been successfully created.`,
        });
      } catch (error) {
        console.error('Failed to create alarm:', error);
        Alert.alert('Error', 'Failed to create alarm, please try again.');
      }
    },
    [alarms],
  );

  const loadAlarms = useCallback(async () => {
    try {
      const savedAlarms = await getAlarms();
      console.log('Loaded alarms in component:', savedAlarms);
      setAlarms(savedAlarms);
    } catch (error) {
      console.error('Failed to load alarms:', error);
    }
  }, []);

  // Reload alarms when the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      loadAlarms();
    }
  }, [isFocused, loadAlarms]);

  useEffect(() => {
    const initializeAlarms = async () => {
      try {
        // Setup notification listener
        TaskManager.setupNotificationListener();

        // Request notification permissions
        const hasPermission =
          await TaskManager.requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert(
            'Notifications Permissions',
            'Please enable notifications to use alarms',
            [{ text: 'OK' }],
          );
        }

        // Load and schedule alarms
        await loadAlarms();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAlarms();
  }, []);

  // Schedule all enabled alarms
  const scheduleAlarms = useCallback(async () => {
    try {
      // First, cancel all existing alarm notifications
      for (const alarm of alarms) {
        await TaskManager.unregisterAlarmTask(alarm.id);
      }

      // Then schedule the enabled ones
      for (const alarm of alarms) {
        if (alarm.enabled) {
          await TaskManager.registerAlarmTask(alarm);
          console.log(
            `Scheduled alarm: ${alarm.id}, ${alarm.time}, ${alarm.label}`,
          );
        }
      }
    } catch (error) {
      console.error('Failed to schedule alarms:', error);
      Alert.alert('Error', 'Failed to schedule alarms, please try again.');
    }
  }, [alarms]);

  // Effect to reschedule alarms when the alarms state changes
  useEffect(() => {
    if (alarms.length > 0) {
      scheduleAlarms();
    }
  }, [alarms, scheduleAlarms]);

  // const loadAlarms = useCallback(async () => {
  //   try {
  //     const savedAlarms = await getAlarms();
  //     console.log('Loaded alarms in component:', savedAlarms);
  //     setAlarms(savedAlarms);
  //   } catch (error) {
  //     console.error('Failed to load alarms:', error);
  //   }
  // }, []);

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
      Alert.alert('Error', 'Failed to delete alarms, please try again.');
    }
  }, [selectedAlarms, alarms]);

  const toggleAlarm = useCallback(
    async (id: string) => {
      const alarm = alarms.find((a) => a.id === id);
      if (!alarm) return;

      const updatedAlarm = { ...alarm, enabled: !alarm.enabled };
      const updatedAlarms = alarms.map((a) => (a.id === id ? updatedAlarm : a));

      try {
        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);
      } catch (error) {
        console.error('Failed to toggle alarm:', error);
        Alert.alert('Error', 'Failed to toggle alarm, please try again.');
      }
    },
    [alarms],
  );

  const filteredAlarms = alarms.filter(
    (alarm) =>
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery),
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
                : toggleAlarm(item.id)
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
              onValueChange={() => toggleAlarm(item.id)}
              trackColor={{ false: '#333', true: '#60a5fa' }}
              thumbColor={item.enabled ? '#fff' : '#666'}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
