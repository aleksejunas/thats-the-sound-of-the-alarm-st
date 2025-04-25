import * as Notifications from 'expo-notifications';
import { registerAlarmTask } from './taskManager';

// Define the types for the alarm object
interface Alarm {
  time: string | number;
  label: string;
  id: string;
}

export const scheduleAlarmNotification = async (alarm: Alarm) => {
  // Convert alarm.time to Date (it might be a timestamp or ISO string)
  const triggerDate = new Date(alarm.time);

  // Check if the date is valid
  if (isNaN(triggerDate.getTime())) {
    console.error('Invalid alarm time:', alarm.time);
    return;
  }

  // Trigger object with the required 'type' and 'date'
  const trigger: Notifications.DateTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE, // Correct type for the trigger
    date: triggerDate, // Use the Date object for scheduling the alarm
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Alarm',
      body: alarm.label,
      sound: true,
    },
    trigger, // Pass trigger directly
  });
};

export const cancelAlarmNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default {
  registerAlarmTask,
  unregisterAlarmTask,
};
