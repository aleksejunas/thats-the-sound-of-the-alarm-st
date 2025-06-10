import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { getThemedColors } from '@/theme/colors';

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

  // Convert time string to Date object
  const getDateFromTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  // Convert Date object to time string
  const formatTimeFromDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const showTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: getDateFromTime(time),
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            const newTime = formatTimeFromDate(selectedDate);
            onTimeChange(newTime);
          }
        },
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowPicker(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        className="p-4 self-center"
        onPress={showTimePicker}
        style={{ backgroundColor: colors.card }}
      >
        <Text
          className="text-5xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {time}
        </Text>
      </TouchableOpacity>
      {showPicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={getDateFromTime(time)}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (event.type === 'set' && selectedDate) {
              const newTime = formatTimeFromDate(selectedDate);
              onTimeChange(newTime);
            }
          }}
        />
      )}
    </>
  );
};

export default TimePicker;
