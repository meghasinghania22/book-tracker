import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import {
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  X,
  Plus,
} from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { theme } from '@/constants/theme';
import { mockMultiBook } from '@/data/mockMultiBook';
import { mockSingleBook } from '@/data/mockSingleBook';

type ScanMode = 'barcode' | 'cover';
type BookStatus =
  | 'want_to_read'
  | 'currently_reading'
  | 'read'
  | 'did_not_finish';

interface DetectedBook {
  id: number;
  title: string;
  author: string;
  coverUrl?: string;
  rating?: number;
  reviews?: number;
  selected?: boolean;
}

export default function ScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('cover');
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedBooks, setDetectedBooks] = useState<DetectedBook[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<DetectedBook | null>(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  useEffect(() => {
    if (params.imageUri) {
      // If it's the local image, use require
      const imageSource =
        params.imageUri === 'local'
          ? require('../assets/images/books.jpg')
          : params.imageUri;

      setCapturedImage(imageSource);
      const detectedBooks = simulateBookDetection(true);
      setDetectedBooks(detectedBooks);
      setScanning(true);
    }
  }, [params.imageUri]);

  useEffect(() => {
    requestPermission();
  }, []);

  const simulateBookDetection = (fromGallery: boolean) => {
    if (!fromGallery) {
      return [mockSingleBook[0]].map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        rating: book.rating,
        reviews: book.reviews,
        selected: false,
      }));
    }

    return mockMultiBook.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      rating: book.rating,
      reviews: book.reviews,
      selected: false,
    }));
  };

  const handleBarCodeScanned = ({ data }) => {
    if (scanning) return;
    setScanning(true);
    const detectedBooks = simulateBookDetection(false);
    setDetectedBooks(detectedBooks);
  };

  const handleTextRecognized = ({ textBlocks }) => {
    if (scanning) return;
    setScanning(true);
    const detectedBooks = simulateBookDetection(false);
    setDetectedBooks(detectedBooks);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
        const detectedBooks = simulateBookDetection(false);
        setDetectedBooks(detectedBooks);
        setScanning(true);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const pickImage = () => {
    setIsCameraActive(false);
    router.push('/gallery');
  };

  const handleBookSelect = (book: DetectedBook) => {
    setSelectedBook(book);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = (status: BookStatus) => {
    if (!selectedBook) return;

    console.log('Update book status:', status, 'for book:', selectedBook.title);

    setDetectedBooks((prev) =>
      prev.map((book) =>
        book.id === selectedBook.id ? { ...book, selected: true } : book
      )
    );

    setShowStatusModal(false);
    setSelectedBook(null);
  };

  const handleBack = useCallback(() => {
    setIsCameraActive(false);
    if (cameraRef) {
      setCameraRef(null);
    }
    router.push('/(tabs)/discover');
  }, []);

  const resetScan = () => {
    setCapturedImage(null);
    setDetectedBooks([]);
    setScanning(false);
    setShowStatusModal(false);
    setSelectedBook(null);
    setIsCameraActive(true);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Scan Book',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          }}
        />
        <View style={styles.messageContainer}>
          <Camera size={48} color={theme.colors.neutral[400]} />
          <Text style={styles.permissionText}>
            Camera permission is required to scan books
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Scan Book',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />

      {capturedImage ? (
        <View style={styles.previewContainer}>
          <View style={styles.imagePreviewContainer}>
            <Image
              source={
                typeof capturedImage === 'string'
                  ? { uri: capturedImage }
                  : capturedImage
              }
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bookInfoOverlay}>
            <ScrollView style={styles.detectedBooksContainer}>
              <View style={styles.detectedBooksHeader}>
                <Text style={styles.detectedBooksTitle}>
                  {detectedBooks.length}{' '}
                  {detectedBooks.length === 1 ? 'Book' : 'Books'} Found
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={resetScan}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {detectedBooks.map((book) => (
                <View key={book.id} style={styles.detectedBookItem}>
                  {book.coverUrl && (
                    <Image
                      source={{ uri: book.coverUrl }}
                      style={styles.bookThumbnail}
                    />
                  )}
                  <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>by {book.author}</Text>

                    {book.rating && (
                      <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>
                          ★ {book.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.reviews}>
                          ({book.reviews?.toLocaleString()} reviews)
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      book.selected && styles.addButtonSelected,
                    ]}
                    onPress={() => handleBookSelect(book)}
                    disabled={book.selected}
                  >
                    {book.selected ? (
                      <Text style={styles.addButtonTextSelected}>Added</Text>
                    ) : (
                      <>
                        <Plus size={20} color={theme.colors.primary[600]} />
                        <Text style={styles.addButtonText}>Add</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {showStatusModal && selectedBook && (
            <View style={styles.statusModal}>
              <View style={styles.statusModalContent}>
                <View style={styles.statusModalHeader}>
                  <Text style={styles.statusModalTitle}>Add to List</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowStatusModal(false);
                      setSelectedBook(null);
                    }}
                    style={styles.statusModalCloseButton}
                  >
                    <Text style={styles.statusModalCloseText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.selectedBookInfo}>
                  <Text style={styles.selectedBookTitle}>
                    {selectedBook.title}
                  </Text>
                  <Text style={styles.selectedBookAuthor}>
                    by {selectedBook.author}
                  </Text>
                </View>

                <View style={styles.statusOptions}>
                  {[
                    { id: 'want_to_read', label: 'Want to read' },
                    { id: 'currently_reading', label: 'Currently reading' },
                    { id: 'read', label: 'Mark as read' },
                    { id: 'did_not_finish', label: 'Did not finish' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.statusOption}
                      onPress={() =>
                        handleUpdateStatus(option.id as BookStatus)
                      }
                    >
                      <Text style={styles.statusOptionText}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      ) : isCameraActive ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={(ref) => setCameraRef(ref)}
            style={styles.camera}
            type={cameraType}
            onBarcodeScanned={
              scanMode === 'barcode' && !scanning
                ? handleBarCodeScanned
                : undefined
            }
            onTextRecognized={
              scanMode === 'cover' && !scanning
                ? handleTextRecognized
                : undefined
            }
            barcodeScannerSettings={{
              barCodeTypes: ['ean13', 'isbn13'],
            }}
          >
            <View style={styles.overlay}>
              <View
                style={[
                  styles.scanArea,
                  scanMode === 'cover' && styles.scanAreaLarge,
                ]}
              >
                <Text style={styles.scanText}>
                  {scanMode === 'barcode'
                    ? 'Position the barcode within the frame'
                    : 'Position the book cover within the frame'}
                </Text>
              </View>
            </View>
          </CameraView>

          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <ImageIcon size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
  },
  headerButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  scanAreaLarge: {
    width: 300,
    height: 400,
  },
  scanText: {
    position: 'absolute',
    bottom: -40,
    color: '#fff',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
  },
  imagePreviewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  bookInfoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  detectedBooksContainer: {
    flex: 1,
  },
  detectedBooksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  detectedBooksTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  detectedBookItem: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bookThumbnail: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral[800],
  },
  bookDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[300],
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 14,
    color: theme.colors.warning,
    marginRight: 4,
  },
  reviews: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[400],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginLeft: 12,
    gap: 4,
  },
  addButtonSelected: {
    backgroundColor: theme.colors.primary[600],
  },
  addButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[600],
  },
  addButtonTextSelected: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  statusModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  statusModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  statusModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusModalTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  statusModalCloseButton: {
    padding: 8,
  },
  statusModalCloseText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.neutral[500],
  },
  selectedBookInfo: {
    marginBottom: 24,
  },
  selectedBookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  selectedBookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[600],
  },
  statusOptions: {
    marginBottom: 24,
  },
  statusOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  statusOptionText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
