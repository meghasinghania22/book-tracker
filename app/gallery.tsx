import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import { theme } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const spacing = 2;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

// Local image needs to be required statically
const localImage = require('../assets/images/books.jpg');

// Combine local image with Pexels photos
const galleryImages = [
  { id: 'local', uri: localImage },
  ...[
    'https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg',
    'https://images.pexels.com/photos/2816903/pexels-photo-2816903.jpeg',
    'https://images.pexels.com/photos/3747443/pexels-photo-3747443.jpeg',
    'https://images.pexels.com/photos/3747548/pexels-photo-3747548.jpeg',
    'https://images.pexels.com/photos/3747534/pexels-photo-3747534.jpeg',
    'https://images.pexels.com/photos/3747466/pexels-photo-3747466.jpeg',
  ].map((url, index) => ({
    id: (index + 1).toString(),
    uri: url,
  })),
];

export default function GalleryScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const handleImageSelect = (image: any) => {
    setSelectedImage(image);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      router.push({
        pathname: '/scan',
        params: {
          imageUri: selectedImage.id === 'local' ? 'local' : selectedImage.uri,
        },
      });
    }
  };

  const handleBack = () => {
    router.push('/scan');
  };

  const renderImage = ({ item, index }) => {
    const isLocal = item.id === 'local';
    const isSelected = selectedImage && selectedImage.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.imageContainer,
          {
            marginLeft: index % numColumns === 0 ? spacing : 0,
            marginRight: spacing,
          },
        ]}
        onPress={() => handleImageSelect(item)}
        activeOpacity={0.7}
      >
        <Image
          source={isLocal ? localImage : { uri: item.uri }}
          style={styles.image}
          resizeMode={isLocal ? 'contain' : 'cover'}
        />
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <Check size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Select Photo',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () =>
            selectedImage ? (
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.headerButton}
              >
                <Check size={24} color={theme.colors.primary[600]} />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <FlatList
        data={galleryImages}
        numColumns={numColumns}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    padding: 8,
  },
  list: {
    paddingTop: spacing,
    paddingBottom: 24,
  },
  imageContainer: {
    width: itemWidth,
    aspectRatio: 1,
    marginBottom: spacing,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.neutral[100],
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
