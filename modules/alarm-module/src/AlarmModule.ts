import { NativeModule, requireNativeModule } from 'expo';

export type NativeAlarm = {
  id: string;
  hour: number;
  minute: number;
  days: number[]; // Calendar: 1 = Sun ... 7 = Sat, empty = one-time
  label: string;
};

declare class AlarmModule extends NativeModule {
  ping(): string;
  setAlarms(alarms: NativeAlarm[]): void;
  getAlarms(): string[];
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AlarmModule>('AlarmModule');
