import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { getThemedColors } from '@/theme/colors';
import { AndroidNotificationPriority } from 'expo-notifications';

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  isdarkMode: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
  isdarkMode,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const colors = getThemedColors(isdarkMode);

  // DateTimePickerAndroid.open = (options) => {
  //   const { mode, value, is24Hour, display, onChange } = options;
  //   DateTimePickerAndroid.open({
  //     mode,
  //     value: new Date(`1970-01-01T${value};00`),
  //     is24Hour,
  //     display,
  //     onChange: (_, selectedDate) => {
  //       if (selectedDate) {
  //         const hours = selectedDate.getHours().toString().padStart(2, '0');
  //         const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
  //         onChange(_, `${hours}:${minutes}`);
  //       }
  //     },
  //   });
  // };

  return (
    <>
      <TouchableOpacity
        className="p-4 self-center"
        onPress={() => setShowPicker(true)}
        style={{ backgroundColor: colors.card }}
      >
        <Text
          className="text-5xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {time}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={new Date(`1970-01-01T${time};00`)}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              const hours = selectedDate.getHours().toString().padStart(2, '0');
              const minutes = selectedDate
                .getMinutes()
                .toString()
                .padStart(2, '0');
              onTimeChange(`${hours}:${minutes}`);
            }
          }}
        />
      )}
    </>
  );
};

export default TimePicker;
