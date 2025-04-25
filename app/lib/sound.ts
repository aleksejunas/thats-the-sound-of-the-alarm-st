import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

/**
 * Play alarm sound and return the Sound object
 */
const playAlarmSound = async (): Promise<void> => {
  try {
    // Unload any existing sound first
    if (sound) {
      await sound.unloadAsync();
    }

    // Load and play the alarm sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      // Use a default system sound or your own custom sound file
      require('../../assets/sounds/mixkit-morning-birds-2472.mp3'), // Make sure this file exists
      { shouldPlay: true, isLooping: true }
    );

    sound = newSound;

    // Set up playback status update to know when sound completes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        // Sound finished playing
        console.log('Sound finished playing');
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Stop the currently playing alarm sound
 */
const stopAlarmSound = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Error stopping sound:', error);
  }
};

export default {
  playAlarmSound,
  stopAlarmSound,
};
