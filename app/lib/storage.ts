import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

const ALARMS_STORAGE_KEY = '@alarms';

export async function getAlarms(): Promise<Alarm[]> {
  try {
    const data = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
    if (!data) return [];
    const alarms = JSON.parse(data);
    console.log('Loaded alarms:', alarms); // Debug log
    return alarms;
  } catch (error) {
    console.error('Error loading alarms:', error);
    throw error; // Propagate error instead of returning empty array
  }
}

export async function saveAlarms(alarms: Alarm[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(alarms);
    console.log('Saving alarms:', alarms); // Debug log
    await AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving alarms:', error);
    throw error; // Propagate error
  }
}

export async function addAlarm(alarm: Omit<Alarm, 'id'>): Promise<Alarm> {
  const alarms = await getAlarms();
  const newAlarm = {
    ...alarm,
    id: Math.random().toString(36).substring(7),
  };

  await saveAlarms([...alarms, newAlarm]);
  return newAlarm;
}

export async function deleteAlarm(id: string): Promise<void> {
  const alarms = await getAlarms();
  await saveAlarms(alarms.filter((alarm) => alarm.id !== id));
}

export async function updateAlarm(alarm: Alarm): Promise<void> {
  const alarms = await getAlarms();
  await saveAlarms(alarms.map((a) => (a.id === alarm.id ? alarm : a)));
}

// Added so the file is not mistakenly treated as a React component
export default {
  getAlarms,
  saveAlarms,
  addAlarm,
  deleteAlarm,
  updateAlarm,
};
