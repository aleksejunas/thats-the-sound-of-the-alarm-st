// ***** /app/components/ReactNativeDatePicker.tsx *****
import React, { useState } from 'react';
import { Button } from 'react-native';
import DatePicker from 'react-native-date-picker';

const ReactNativeDatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title="Open Date Picker" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        mode="time"
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default ReactNativeDatePicker;
