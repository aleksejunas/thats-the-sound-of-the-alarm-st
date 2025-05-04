import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusTimer } from '../context/FocusTimerContext';
import { useTheme } from '../context/ThemeContext';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';

const FocusTimer = () => {
  const {
    time,
    status,
    isBreak,
    focusDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    setFocusDuration,
    setBreakDuration,
  } = useFocusTimer();
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode
    ? 'text-dark-text-primary'
    : 'text-light-text-primary';
  const secondaryTextColor = isDarkMode
    ? 'text-dark-text-secondary'
    : 'text-light-text-secondary';
  const bgColor = isDarkMode ? 'bg-dark-card' : 'bg-light-card';
  const borderColor = isDarkMode ? 'border-dark-border' : 'border-light-border';

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = isBreak ? breakDuration * 60 : focusDuration * 60;
    return (time / totalTime) * 100;
  };

  // Custom duration controls instead of Slider
  const changeFocusDuration = (increment: boolean) => {
    if (increment) {
      setFocusDuration(Math.min(60, focusDuration + 5));
    } else {
      setFocusDuration(Math.max(5, focusDuration - 5));
    }
  };

  const changeBreakDuration = (increment: boolean) => {
    if (increment) {
      setBreakDuration(Math.min(30, breakDuration + 1));
    } else {
      setBreakDuration(Math.max(1, breakDuration - 1));
    }
  };

  return (
    <View className={`${bgColor} rounded-xl p-6 shadow-md`}>
      <Text className={`text-xl font-semibold ${textColor}`}>
        Focus Timer {isBreak ? '(Break)' : ''}
      </Text>

      {/* Timer Display */}
      <View className="items-center justify-center my-6">
        <View
          className="w-44 h-44 rounded-full border-4 border-primary items-center justify-center"
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
          }}
        >
          <Text className={`text-5xl font-bold ${textColor}`}>
            {formatTime(time)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="flex-row justify-center items-center space-x-4 mb-6 gap-1.5">
        <TouchableOpacity
          className="p-3 bg-primary rounded-full"
          onPress={resetTimer}
        >
          <RotateCcw size={22} color="white" />
        </TouchableOpacity>

        {status === 'running' ? (
          <TouchableOpacity
            className="p-4 bg-primary rounded-full"
            onPress={pauseTimer}
          >
            <Pause size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="p-4 bg-primary rounded-full"
            onPress={startTimer}
          >
            <Play size={24} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="p-3 bg-primary rounded-full"
          onPress={skipToBreak}
        >
          <SkipForward size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Duration Settings */}
      <View className="mb-4">
        <Text className={`text-base font-medium mb-2 ${textColor}`}>
          Focus Duration: {focusDuration} min
        </Text>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'}`}
            onPress={() => changeFocusDuration(false)}
          >
            <Text className={textColor}>-</Text>
          </TouchableOpacity>
          <View className="flex-1 h-2 mx-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(focusDuration / 60) * 100}%` }}
            />
          </View>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'}`}
            onPress={() => changeFocusDuration(true)}
          >
            <Text className={textColor}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className={`text-base font-medium mb-2 ${textColor}`}>
          Break Duration: {breakDuration} min
        </Text>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'}`}
            onPress={() => changeBreakDuration(false)}
          >
            <Text className={textColor}>-</Text>
          </TouchableOpacity>
          <View className="flex-1 h-2 mx-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(breakDuration / 30) * 100}%` }}
            />
          </View>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-dark-card-highlight' : 'bg-light-card-highlight'}`}
            onPress={() => changeBreakDuration(true)}
          >
            <Text className={textColor}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FocusTimer;
