import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Mic } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface FABProps {
  onPress: () => void;
  style?: ViewStyle;
}

export function FAB({ onPress, style }: FABProps) {
  return (
    <TouchableOpacity 
      style={[styles.fab, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Mic size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});