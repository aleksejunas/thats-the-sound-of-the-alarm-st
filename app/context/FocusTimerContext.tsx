import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

type FocusTimerContextType = {
  time: number; // in seconds
  status: TimerStatus;
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  isBreak: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToBreak: () => void;
  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
};

const FocusTimerContext = createContext<FocusTimerContextType | null>(null);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [time, setTime] = useState<number>(25 * 60); // Default 25 minutes in seconds
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [focusDuration, setFocusDuration] = useState<number>(25); // 25 minutes default
  const [breakDuration, setBreakDuration] = useState<number>(5); // 5 minutes default
  const [isBreak, setIsBreak] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const lastActiveTime = useRef<number | null>(null);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (status === 'running') {
        if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
          // App is going to background
          lastActiveTime.current = Date.now();
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          // App is coming to foreground
          if (lastActiveTime.current) {
            const timePassed = Math.floor((Date.now() - lastActiveTime.current) / 1000);
            setTime((prev) => Math.max(0, prev - timePassed));
            startTimerInterval();
          }
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [status]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer running effect
  useEffect(() => {
    if (status === 'running') {
      startTimerInterval();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Check if timer is completed
  useEffect(() => {
    if (time <= 0 && status === 'running') {
      setStatus('completed');
      if (isBreak) {
        // Switch to focus mode after break
        setIsBreak(false);
        setTime(focusDuration * 60);
      } else {
        // Switch to break mode
        setIsBreak(true);
        setTime(breakDuration * 60);
      }
    }
  }, [time, status, isBreak, focusDuration, breakDuration]);

  const startTimerInterval = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          return newTime >= 0 ? newTime : 0;
        });
      }, 1000);
    }
  };

  const startTimer = () => {
    if (status === 'idle' && !isBreak) {
      setTime(focusDuration * 60);
    } else if (status === 'idle' && isBreak) {
      setTime(breakDuration * 60);
    }
    setStatus('running');
  };

  const pauseTimer = () => {
    setStatus('paused');
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTime(isBreak ? breakDuration * 60 : focusDuration * 60);
    setStatus('idle');
  };

  const skipToBreak = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsBreak(!isBreak);
    setTime(!isBreak ? breakDuration * 60 : focusDuration * 60);
    setStatus('idle');
  };

  const handleSetFocusDuration = (minutes: number) => {
    setFocusDuration(minutes);
    if (!isBreak && status === 'idle') {
      setTime(minutes * 60);
    }
  };

  const handleSetBreakDuration = (minutes: number) => {
    setBreakDuration(minutes);
    if (isBreak && status === 'idle') {
      setTime(minutes * 60);
    }
  };

  return (
    <FocusTimerContext.Provider
      value={{
        time,
        status,
        focusDuration,
        breakDuration,
        isBreak,
        startTimer,
        pauseTimer,
        resetTimer,
        skipToBreak,
        setFocusDuration: handleSetFocusDuration,
        setBreakDuration: handleSetBreakDuration,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};

// Add default export
export default FocusTimerContext;