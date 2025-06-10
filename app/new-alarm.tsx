import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Clock, Calendar, Save } from 'lucide-react-native';
import { useAlarms } from './context/AlarmsContext';
import { useTheme } from './context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativeDatePicker from './components/ReactNativeDatePicker';
import { getThemedColors } from '@/theme/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simple function to generate a random ID without crypto
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export default function NewAlarmScreen() {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState('idle');
  const { createAlarm } = useAlarms();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = getThemedColors(isDarkMode);

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  const validateTime = (timeString: string): boolean => {
    // Simple regex for 24-hour time format (00:00 to 23:59)
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(timeString);
  };

  const saveAlarm = () => {
    console.log('Save button pressed - starting alarm creation');

    if (isSaving) {
      console.log('Already saving, ignoring duplicate press');
      return;
    }

    // Validate time format
    if (!validateTime(time)) {
      console.log('Time validation failed:', time);
      Alert.alert(
        'Invalid Time',
        'Please enter a valid time in 24-hour format (HH:MM)'
      );
      return;
    }

    setIsSaving(true);

    // Create the alarm object - use our simple ID generator instead of uuid
    const newAlarm = {
      id: generateId(),
      time,
      label: label || 'Alarm',
      days: selectedDays,
      enabled: true,
    };

    console.log('Created alarm object:', newAlarm);

    // Using immediate function to properly handle async
    (async () => {
      try {
        console.log('Calling createAlarm with:', newAlarm);
        await createAlarm(newAlarm);
        console.log('Alarm saved successfully, navigating back');
        router.back();
      } catch (error) {
        console.error('Error saving alarm:', error);
        Alert.alert('Error', 'Failed to save the alarm. Please try again.');
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: colors.background }}
    >
      <View
        className="flex-row items-center justify-between p-4 border-b"
        style={{ borderBlockColor: colors.border }}
      >
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <ChevronLeft color={isDarkMode ? '#cbd5e1' : '#64748b'} size={24} />
        </TouchableOpacity>
        <Text
          className="text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          New Alarm
        </Text>
        <TouchableOpacity
          className={`p-2 ${isSaving ? 'opacity-50' : ''}`}
          onPress={saveAlarm}
          disabled={isSaving}
        >
          <Save
            style={{ backgroundColor: colors.background }}
            color="#818CF8"
            size={28}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        <View
          className="p-6 mb-4 rounded-lg border"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-4">
            <Clock size={20} color={isDarkMode ? '#cbd5e1' : '#64748b'} />
            <Text
              className="ml-2 text-lg font-medium"
              style={{ color: colors.text.primary }}
            >
              Time
            </Text>
          </View>
          <ReactNativeDatePicker
            time={time}
            onTimeChange={setTime}
            isDarkMode={isDarkMode}
            onStateChange={setState}
          />
        </View>

        <View
          className="p-6 mb-4 rounded-lg border"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <Text
            className="mb-2 text-lg font-medium"
            style={{ color: colors.text.primary }}
          >
            Label
          </Text>
          <TextInput
            className="border-b pb-2"
            style={{ color: colors.text.primary }}
            value={label}
            onChangeText={setLabel}
            placeholder="Alarm label"
            placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
          />
        </View>

        <View
          className="p-6 rounded-lg border"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color={isDarkMode ? '#cbd5e1' : '#64748b'} />
            <Text
              className="ml-2 text-lg font-medium"
              style={{ color: colors.text.primary }}
            >
              Repeat on Days
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                className="mb-3 h-12 w-12 rounded-lg items-center justify-center"
                style={{
                  backgroundColor: selectedDays.includes(day)
                    ? colors.primaryLight
                    : colors.cardHighlight,
                }}
                onPress={() => toggleDay(day)}
              >
                <Text
                  className="text-sm font-medium p-4 rounded-full"
                  style={{
                    // TODO: Make text color white or black based on background
                    color: selectedDays.includes(day)
                      ? isDarkMode
                        ? colors.text.primary
                        : colors.text.white
                      : isDarkMode
                      ? colors.text.white
                      : colors.text.primary,
                  }}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            className="mt-2 text-center"
            style={{ color: colors.text.secondary }}
          >
            {selectedDays.length === 0
              ? 'Alarm will ring only once'
              : selectedDays.length === 7
              ? 'Alarm will ring every day'
              : `Alarm will ring on ${selectedDays.join(', ')}`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
{
  /*       > */
}
{
  /*         {day} */
}
{
  /*       </Text> */
}
{
  /*     </TouchableOpacity> */
}
{
  /*   ))} */
}
{
  /* </View> */
}

//           <View className="flex-row flex-wrap justify-between">
//             {DAYS.map((day) => (
//               <TouchableOpacity
//                 key={day}
//                 className="mb-3 h-12 w-12 rounded-lg items-center justify-center"
//                 style={{
//                   backgroundColor: selectedDays.includes(day)
//                     ? colors.primaryLight
//                     : colors.cardHighlight,
//                 }}
//                 onPress={() => toggleDay(day)}
//               >
//                 <Text
//                   className="text-sm font-medium p-4 rounded-full"
//                   style={{
//                     // TODO: Make text color white or black based on background
//                     color: selectedDays.includes(day)
//                       ? isDarkMode
//                         ? colors.text.primary
//                         : colors.text.white
//                       : isDarkMode
//                         ? colors.text.white
//                         : colors.text.primary,
//                   }}
//                 >
//                   {day}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text
//             className="mt-2 text-center"
//             style={{ color: colors.text.secondary }}
//           >
//             {selectedDays.length === 0
//               ? 'Alarm will ring only once'
//               : selectedDays.length === 7
//                 ? 'Alarm will ring every day'
//                 : `Alarm will ring on ${selectedDays.join(', ')}`}
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
