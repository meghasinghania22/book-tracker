import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface ReadingTimerProps {
  isActive: boolean;
  elapsedTime: number; // Total elapsed time in seconds
}

export function ReadingTimer({ isActive, elapsedTime }: ReadingTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(elapsedTime);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  // Format time from seconds to HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <View style={styles.container}>
      <Clock size={16} color={isActive ? theme.colors.primary[600] : theme.colors.neutral[500]} />
      <Text style={[
        styles.timerText,
        isActive && styles.activeTimerText
      ]}>
        {formatTime(timeElapsed)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timerText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[500],
    marginLeft: 8,
  },
  activeTimerText: {
    color: theme.colors.primary[600],
  },
});