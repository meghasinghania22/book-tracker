import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Book, Users, Search, Library, CircleUser } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '@/components/FAB';
import { VoiceSearchModal } from '@/components/VoiceSearchModal';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [voiceSearchVisible, setVoiceSearchVisible] = useState(false);

  const handleVoiceSearch = () => {
    setVoiceSearchVisible(true);
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: theme.colors.primary[700],
          tabBarInactiveTintColor: theme.colors.neutral[400],
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Book size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="clubs"
          options={{
            title: 'Clubs',
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Search size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => (
              <Library size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <CircleUser size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>

      <FAB 
        onPress={handleVoiceSearch} 
        style={[
          styles.fab,
          { bottom: 80 + insets.bottom } // Position above tab bar
        ]}
      />
      
      <VoiceSearchModal
        visible={voiceSearchVisible}
        onClose={() => setVoiceSearchVisible(false)}
        onResult={(text) => {
          console.log('Voice search result:', text);
          // Handle the voice search result
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.neutral[200],
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
  },
});