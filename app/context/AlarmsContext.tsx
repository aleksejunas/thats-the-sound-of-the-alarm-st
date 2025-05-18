import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Alarm, saveAlarms, getAlarms } from '../../lib/storage';
import TaskManager from '../../lib/taskManager';

type AlarmsContextType = {
  alarms: Alarm[];
  isLoading: boolean;
  createAlarm: (newAlarm: Alarm) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  deleteMultipleAlarms: (ids: string[]) => Promise<void>;
  toggleAlarm: (id: string) => Promise<void>;
  updateAlarm: (id: string, updatedData: Partial<Alarm>) => Promise<void>;
  loadAlarms: () => Promise<void>;
};

const AlarmsContext = createContext<AlarmsContextType | null>(null);

export const AlarmsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load alarms from storage
  const loadAlarms = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedAlarms = await getAlarms();
      console.log('Loaded alarms from storage:', savedAlarms);
      setAlarms(savedAlarms);
    } catch (error) {
      console.error('Failed to load alarms:', error);
      Alert.alert('Error', 'Failed to load alarms, please restart the app.');
    } finally {
      setIsLoading(false);
    }
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

  // Effect to initialize notifications and permissions
  useEffect(() => {
    const initializeApp = async () => {
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

        await loadAlarms();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, [loadAlarms]);

  // Effect to reschedule alarms when the alarms state changes
  useEffect(() => {
    if (alarms.length > 0 && !isLoading) {
      scheduleAlarms();
    }
  }, [alarms, scheduleAlarms, isLoading]);

  // Create a new alarm - rewritten to be more robust
  const createAlarm = useCallback(
    async (newAlarm: Alarm) => {
      console.log('AlarmsContext: Creating alarm - started', newAlarm);

      if (!newAlarm || !newAlarm.id || !newAlarm.time) {
        console.error('Invalid alarm data provided:', newAlarm);
        Alert.alert('Error', 'Invalid alarm data provided');
        throw new Error('Invalid alarm data');
      }

      try {
        // First get current alarms to ensure we have the latest
        const currentAlarms = await getAlarms();
        console.log('Current alarms before adding new one:', currentAlarms);

        // Create updated list with new alarm
        const updatedAlarms = [...currentAlarms, newAlarm];
        console.log('New alarm list to save:', updatedAlarms);

        // Save to AsyncStorage
        await saveAlarms(updatedAlarms);
        console.log('Alarms saved to storage successfully');

        // Update local state
        setAlarms(updatedAlarms);
        console.log('Local state updated with new alarm');

        // Show toast notification
        Toast.show({
          type: 'success',
          text1: 'Alarm Created',
          text2: `Alarm for ${newAlarm.time} has been set.`,
          position: 'bottom',
          visibilityTime: 4000,
        });

        // Return void instead of true to match the function signature
        return;
      } catch (error) {
        console.error('Failed to create alarm:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        }
        Alert.alert('Error', 'Failed to save alarm. Please try again.');
        throw error;
      }
    },
    [], // Removed alarms dependency to avoid stale data
  );

  // Delete an alarm
  const deleteAlarm = useCallback(
    async (id: string) => {
      try {
        const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);

        Toast.show({
          type: 'success',
          text1: 'Alarm Deleted',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Failed to delete alarm:', error);
        Alert.alert('Error', 'Failed to delete alarm, please try again.');
      }
    },
    [alarms],
  );

  // Delete multiple alarms
  const deleteMultipleAlarms = useCallback(
    async (ids: string[]) => {
      try {
        const updatedAlarms = alarms.filter((alarm) => !ids.includes(alarm.id));
        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);

        Toast.show({
          type: 'success',
          text1: `${ids.length} Alarms Deleted`,
          position: 'bottom',
        });
      } catch (error) {
        console.error('Failed to delete alarms:', error);
        Alert.alert('Error', 'Failed to delete alarms, please try again.');
      }
    },
    [alarms],
  );

  // Toggle alarm enabled state
  const toggleAlarm = useCallback(
    async (id: string) => {
      try {
        const alarm = alarms.find((a) => a.id === id);
        if (!alarm) return;

        const updatedAlarm = { ...alarm, enabled: !alarm.enabled };
        const updatedAlarms = alarms.map((a) =>
          a.id === id ? updatedAlarm : a,
        );

        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);

        Toast.show({
          type: 'info',
          text1: updatedAlarm.enabled ? 'Alarm Enabled' : 'Alarm Disabled',
          text2: updatedAlarm.enabled
            ? `Alarm for ${updatedAlarm.time} is now active.`
            : `Alarm for ${updatedAlarm.time} has been disabled.`,
          position: 'bottom',
        });
      } catch (error) {
        console.error('Failed to toggle alarm:', error);
        Alert.alert('Error', 'Failed to update alarm, please try again.');
      }
    },
    [alarms],
  );

  // Add updateAlarm function
  const updateAlarm = useCallback(
    async (id: string, updatedData: Partial<Alarm>) => {
      try {
        const alarm = alarms.find((a) => a.id === id);
        if (!alarm) {
          throw new Error(`Alarm with id ${id} not found`);
        }

        const updatedAlarm = { ...alarm, ...updatedData };
        const updatedAlarms = alarms.map((a) =>
          a.id === id ? updatedAlarm : a,
        );

        await saveAlarms(updatedAlarms);
        setAlarms(updatedAlarms);

        Toast.show({
          type: 'success',
          text1: 'Alarm Updated',
          position: 'bottom',
        });
      } catch (error) {
        console.error('Failed to update alarm:', error);
        Alert.alert('Error', 'Failed to update alarm, please try again.');
        throw error;
      }
    },
    [alarms],
  );

  return (
    <AlarmsContext.Provider
      value={{
        alarms,
        isLoading,
        createAlarm,
        deleteAlarm,
        deleteMultipleAlarms,
        toggleAlarm,
        updateAlarm,
        loadAlarms,
      }}
    >
      {children}
    </AlarmsContext.Provider>
  );
};

export const useAlarms = () => {
  const context = useContext(AlarmsContext);
  if (!context) {
    throw new Error('useAlarms must be used within an AlarmsProvider');
  }
  return context;
};

// Add default export
export default AlarmsContext;
