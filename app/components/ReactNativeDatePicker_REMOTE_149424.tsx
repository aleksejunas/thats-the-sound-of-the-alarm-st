// ***** /app/components/ReactNativeDatePicker.tsx *****
import React, { useState } from 'react';
import { Button, TouchableOpacity, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { getThemedColors } from '@/theme/colors';

interface ReactNativeDatePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  isDarkMode: boolean;
  onStateChange?: (state: string) => void;
}

const ReactNativeDatePicker: React.FC<ReactNativeDatePickerProps> = ({
  time,
  onTimeChange,
  isDarkMode,
  onStateChange,
}) => {
  const [open, setOpen] = useState(false);
  const colors = getThemedColors(isDarkMode);

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

  return (
    <>
      <TouchableOpacity
        className="p-4 self-center"
        onPress={() => {
          setOpen(true);
          onStateChange?.('picking');
        }}
        style={{ backgroundColor: colors.card }}
      >
        <Text
          className="text-5xl font-bold text-center"
          style={{ color: colors.text.primary }}
        >
          {time}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="time"
        open={open}
        date={getDateFromTime(time)}
        onConfirm={(selectedDate) => {
          setOpen(false);
          const newTime = formatTimeFromDate(selectedDate);
          onTimeChange(newTime);
          onStateChange?.('confirmed');
        }}
        onCancel={() => {
          setOpen(false);
          onStateChange?.('cancelled');
        }}
      />
    </>
  );
};

export default ReactNativeDatePicker;
