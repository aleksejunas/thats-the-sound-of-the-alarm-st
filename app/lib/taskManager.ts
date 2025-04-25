import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications'
import { playAlarmSound } from './sound';


const TASK_NAME = 'ALARM_TASK';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('TaskManager Error:', error);
    return;
  }

  if (data) {
    console.log('Alarm triggered:', data);
    await playAlarmSound();

    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alarm',
        body: data.label || "Time to wake up!",
        sound: true,
      },
      trigger: null, // Trigger immediately
    })
  }
});

interface Alarm {
  time: string | number;
  label: string;
  id: string;
}

export const registerAlarmTask = async (alarm: Alarm) => {
  const trigger = new Date(alarm.time);
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60, // Minimum interval in seconds
    stopOnTerminate: false,
    startOnBoot: true,
    data: alarm, // Pass alarm data to the task
  });
};

export const unregisterAlarmTask = async (taskId: string) => {
  await BackgroundFetch.unregisterTaskAsync(taskId);
};

// Reuqest notification permissions
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
};

