import { NativeModule, requireNativeModule } from 'expo';

declare class AlarmModule extends NativeModule {
  ping(): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AlarmModule>('AlarmModule');
