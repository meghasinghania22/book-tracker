import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.progressFill,
          { width: `${clampedProgress * 100}%` }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[600],
    borderRadius: 4,
  },
});