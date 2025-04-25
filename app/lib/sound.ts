import { Audio } from 'expo-av';

export const playAlarmSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/sounds/mixkit-morning-birds-2472.mp3'),
  );
  await sound.playAsync();
};
