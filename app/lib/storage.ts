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
    console.log('Getting alarms from storage');
    const data = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
    
    if (!data) {
      console.log('No alarms found in storage, returning empty array');
      return [];
    }
    
    try {
      const alarms = JSON.parse(data);
      if (!Array.isArray(alarms)) {
        console.warn('Data in storage is not an array, returning empty array');
        return [];
      }
      console.log('Loaded alarms from storage:', alarms);
      return alarms;
    } catch (parseError) {
      console.error('Error parsing alarms data:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error loading alarms from AsyncStorage:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return []; 
  }
}

export async function saveAlarms(alarms: Alarm[]): Promise<void> {
  if (!alarms || !Array.isArray(alarms)) {
    console.error('Invalid alarms array provided to saveAlarms:', alarms);
    throw new Error('Invalid alarms array');
  }
  
  try {
    console.log('Saving alarms to storage:', alarms);
    const jsonValue = JSON.stringify(alarms);
    
    if (!jsonValue) {
      throw new Error('Failed to stringify alarms array');
    }
    
    console.log('JSON string length:', jsonValue.length);
    
    await Promise.race([
      AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue),
      new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Storage timeout')), 5000)
      )
    ]);
    
    console.log('Alarms saved successfully');
    
    const verificationData = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
    if (!verificationData) {
      console.warn('Verification failed - no data found after save');
    } else {
      console.log('Verification succeeded - data found after save');
    }
  } catch (error) {
    console.error('Error saving alarms to AsyncStorage:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    throw error;
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
