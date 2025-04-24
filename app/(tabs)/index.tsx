import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ClockScreen() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.seconds}>
        {time.getSeconds().toString().padStart(2, '0')}
      </Text>
      <Text style={styles.date}>
        {time.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  seconds: {
    fontSize: 36,
    color: '#60a5fa',
    marginTop: -10,
  },
  date: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
});
