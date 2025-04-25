import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import soundManager from './sound';

const BACKGROUND_FETCH_TASK = 'background-alarm-task';
const ALARM_NOTIFICATION_TASK = 'alarm-notification-task';

// Define the task that runs when a notification is received
TaskManager.defineTask(
  ALARM_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    if (error) {
      console.error(`Error in notification task: ${error}`);
      return;
    }

    try {
      console.log('Alarm notification task running!', data);
      await soundManager.playAlarmSound();
    } catch (error) {
      console.error('Error in notification background task:', error);
    }
  }
);

// Define the background fetch task for rescheduling alarms
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const now = new Date();
    console.log(`[Background Task] Running at ${now.toLocaleTimeString()}`);

    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `Found ${scheduledNotifications.length} scheduled notifications`
    );

    // Check for alarms that need rescheduling (weekly alarms)
    for (const notification of scheduledNotifications) {
      // Weekly alarms have identifiers with the format: alarmId-day
      if (notification.identifier.includes('-')) {
        try {
          // Check if trigger exists and is a DateTriggerInput
          if (notification.trigger && 'date' in notification.trigger) {
            const triggerDate = new Date(notification.trigger.date);

            // If the notification has already triggered, reschedule it for next week
            if (triggerDate < now) {
              // Reschedule for next week
              triggerDate.setDate(triggerDate.getDate() + 7);

              // Cancel old notification
              await Notifications.cancelScheduledNotificationAsync(
                notification.identifier
              );

              // Create new notification content from the old one
              const newContent: Notifications.NotificationContentInput = {
                title: notification.content.title || 'Alarm',
                body: notification.content.body || 'Time to wake up!',
                data: notification.content.data || {},
                sound: true,
              };

              // Create new notification for next week
              await Notifications.scheduleNotificationAsync({
                identifier: notification.identifier,
                content: newContent,
                trigger: {
                  type: 'calendar',
                  date: triggerDate,
                } as Notifications.NotificationTriggerInput,
              });

              console.log(
                `[Background Task] Rescheduled ${notification.identifier
                } for ${triggerDate.toLocaleString()}`
              );
            }
          }
        } catch (error) {
          console.error(
            'Error processing notification:',
            notification.identifier,
            error
          );
        }
      }
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[Background Task] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Setup notification listeners
const setupNotificationListener = () => {
  // Listen for when a notification is received while app is in foreground
  Notifications.addNotificationReceivedListener(async (notification) => {
    console.log('Notification received in foreground:', notification);
    try {
      // Play alarm sound
      await soundManager.playAlarmSound();
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  });

  // Listen for when user interacts with notification
  Notifications.addNotificationResponseReceivedListener(async (response) => {
    console.log('User responded to notification:', response);
    try {
      // Stop sound when notification is acknowledged
      await soundManager.stopAlarmSound();
    } catch (error) {
      console.error('Failed to stop alarm sound:', error);
    }
  });
};

// Interface for alarm objects
interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

// Register an alarm
const registerAlarmTask = async (alarm: Alarm) => {
  // First cancel any existing notifications for this alarm
  await unregisterAlarmTask(alarm.id);

  // Parse the time
  const [hours, minutes] = alarm.time.split(':').map(Number);

  // Validate time format
  if (isNaN(hours) || isNaN(minutes)) {
    console.error('Invalid time format:', alarm.time);
    return;
  }

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();
  const dayMapping = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // If specific days are selected (recurring alarm)
  if (alarm.days && alarm.days.length > 0) {
    console.log(
      `Setting up recurring alarm for days: ${alarm.days.join(', ')}`
    );

    // Schedule for each selected day
    for (const day of alarm.days) {
      const dayIndex = dayMapping.indexOf(day);
      if (dayIndex === -1) continue;

      // Calculate days until the next occurrence of this weekday
      const currentTime = new Date();
      let daysUntilAlarm = (dayIndex - currentDay + 7) % 7;

      // If it's the same day, check if the time has already passed
      if (daysUntilAlarm === 0) {
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        // If the alarm time for today has already passed, schedule it for next week
        if (
          currentHour > hours ||
          (currentHour === hours && currentMinute >= minutes)
        ) {
          daysUntilAlarm = 7;
        }
      }

      // Create trigger date
      const triggerDate = new Date();
      triggerDate.setDate(currentTime.getDate() + daysUntilAlarm);
      triggerDate.setHours(hours, minutes, 0, 0);

      // Create a unique ID for each day's alarm
      const notificationId = `${alarm.id}-${day}`;

      // Calculate seconds until alarm
      const triggerTime = new Date();
      const secondsUntilAlarm = Math.floor(
        (triggerDate.getTime() - triggerTime.getTime()) / 1000
      );

      try {
        await Notifications.scheduleNotificationAsync({
          identifier: notificationId,
          content: {
            title: 'Alarm',
            body: alarm.label || 'Time to wake up!',
            sound: true,
            data: {
              alarmId: alarm.id,
              day: day,
              isRecurring: true,
            },
          },
          trigger: {
            type: 'date',
            date: new Date(Date.now() + secondsUntilAlarm * 1000)
          } as Notifications.NotificationTriggerInput,
        });

        console.log(
          `Alarm for ${day} scheduled for ${triggerDate.toLocaleString()}`
        );
      } catch (error) {
        console.error(`Failed to schedule alarm for ${day}:`, error);
      }
    }

    // Register background task to handle recurring alarms
    await registerBackgroundFetchTask();
  } else {
    // For one-time alarm
    console.log('Setting up one-time alarm');

    const now = new Date();
    const triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    // If the time has already passed today, schedule for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    // Calculate seconds until alarm
    const triggerTime = new Date();
    const secondsUntilAlarm = Math.floor(
      (triggerDate.getTime() - triggerTime.getTime()) / 1000
    );

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: alarm.id,
        content: {
          title: 'Alarm',
          body: alarm.label || 'Time to wake up!',
          sound: true,
          data: {
            alarmId: alarm.id,
            isRecurring: false,
          },
        },
        trigger: {
          type: 'date',
          date: new Date(Date.now() + secondsUntilAlarm * 1000)
        } as Notifications.NotificationTriggerInput,
      });

      console.log(
        `One-time alarm scheduled for ${triggerDate.toLocaleString()}`
      );
    } catch (error) {
      console.error('Failed to schedule one-time alarm:', error);
    }
  }
};

// Register the background fetch task to handle recurring alarms
const registerBackgroundFetchTask = async () => {
  try {
    // Register notification handler task
    await Notifications.registerTaskAsync(ALARM_NOTIFICATION_TASK);
    console.log('Notification handler task registered');

    // Register background fetch task
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    if (!isTaskRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background fetch task registered');
    } else {
      console.log('Background fetch task already registered');
    }
  } catch (error) {
    console.error('Failed to register tasks:', error);
  }
};

// Unregister an alarm task
const unregisterAlarmTask = async (alarmId: string) => {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    // Cancel all notifications related to this alarm
    for (const notification of scheduledNotifications) {
      if (
        notification.identifier === alarmId ||
        notification.identifier.startsWith(`${alarmId}-`)
      ) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
        console.log(`Cancelled notification: ${notification.identifier}`);
      }
    }
  } catch (error) {
    console.error(`Failed to unregister alarm ${alarmId}:`, error);
  }
};

// Request notification permissions
const requestNotificationPermissions = async () => {
  try {
    // Check and request notification permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Check background fetch availability
    const backgroundStatus = await BackgroundFetch.getStatusAsync();
    console.log('Background fetch status:', backgroundStatus);

    // Log if background fetch needs configuration
    if (backgroundStatus === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log('Background fetch is restricted');
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export default {
  registerAlarmTask,
  unregisterAlarmTask,
  requestNotificationPermissions,
  setupNotificationListener,
  registerBackgroundFetchTask,
};
