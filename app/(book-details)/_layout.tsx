import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function BookDetailsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          height: 48,
        },
        contentStyle: {
          paddingTop: 0,
        },
      }}
    >
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={{ 
                padding: 8,
                marginTop: 4,
                marginLeft: -4,
              }}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}