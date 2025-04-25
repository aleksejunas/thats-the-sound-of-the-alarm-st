import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { playAlarmSound } from './sound';

const TASK_NAME = 'ALARM_TASK';

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('TaskManager Error:', error);
    return;
  }

  if (data) {
    console.log('Alarm triggered:', data);
    await playAlarmSound();
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
  });
};

export const unregisterAlarmTask = async (taskId: string) => {
  await BackgroundFetch.unregisterTaskAsync(taskId);
};

// export default {
//   registerAlarmTask,
//   unregisterAlarmTask,
// };
