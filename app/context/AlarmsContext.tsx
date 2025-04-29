import React, { createContext, useContext, useCallback, useState } from 'react';
import { Alarm, saveAlarms } from '../lib/storage';
import Toast from 'react-native-toast-message';

type AlarmsContextType = {
  alarms: Alarm[];
  createAlarm: (newAlarm: Alarm) => Promise<void>;
};

const AlarmsContext = createContext<AlarmsContextType | null>(null);

export const AlarmsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Define the createAlarm function
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
      }
    },
    [alarms],
  );

  return (
    <AlarmsContext.Provider value={{ alarms, createAlarm }}>
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
