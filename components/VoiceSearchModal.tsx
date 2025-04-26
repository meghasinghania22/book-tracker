import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, SafeAreaView, ScrollView, Image } from 'react-native';
import { X, Mic, Star } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { theme } from '@/constants/theme';
import { mockBooksData } from '@/data/mockBooks';

interface VoiceSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onResult?: (text: string) => void;
}

type VoiceStep = 'listening' | 'processing' | 'confirmation' | 'done';

// Filter trending fiction books
const trendingFictionBooks = mockBooksData
  .filter(book => book.genre === 'Fiction' && book.rating && book.rating >= 4.0)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 5);

const simulatedResponses = [
  { 
    command: "Find me a good mystery book", 
    response: "I found several mystery books. Would you like to see 'The Silent Patient' by Alex Michaelides?" 
  },
  { 
    command: "Show me books by Stephen King", 
    response: "Here are some popular books by Stephen King. Would you like to start with 'The Stand'?" 
  },
  { 
    command: "What's trending in fiction", 
    response: "Here are some trending fiction books that readers are loving right now:",
    books: trendingFictionBooks
  },
];

// Function to play the found sound
const playFoundSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/Trending-fiction.m4a'),
      { shouldPlay: true }
    );
    
    // Unload the sound when finished
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

export function VoiceSearchModal({ visible, onClose, onResult }: VoiceSearchModalProps) {
  const [step, setStep] = useState<VoiceStep>('listening');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [waveAnim] = useState(new Animated.Value(0));
  const [detectedCommand, setDetectedCommand] = useState('');
  const [systemResponse, setSystemResponse] = useState('');
  const [responseBooks, setResponseBooks] = useState(trendingFictionBooks);
  const speechTimeout = useRef<NodeJS.Timeout>();
  const previousStep = useRef<VoiceStep>(step);

  useEffect(() => {
    // Initialize audio
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.warn('Failed to set audio mode:', error);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    // Play sound when entering confirmation step
    if (previousStep.current !== step && step === 'confirmation') {
      playFoundSound();
    }
    previousStep.current = step;
  }, [step]);

  useEffect(() => {
    if (visible && step === 'listening') {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start wave animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate voice detection after random time
      speechTimeout.current = setTimeout(() => {
        const randomResponse = simulatedResponses[2]; // Always use trending fiction response
        setDetectedCommand(randomResponse.command);
        setSystemResponse(randomResponse.response);
        setResponseBooks(randomResponse.books || []);
        setStep('processing');
        
        // Show processing state briefly
        setTimeout(() => {
          setStep('confirmation');
        }, 1500);
      }, 3000 + Math.random() * 2000);

      return () => {
        if (speechTimeout.current) {
          clearTimeout(speechTimeout.current);
        }
      };
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [visible, step]);

  const handleClose = () => {
    if (speechTimeout.current) {
      clearTimeout(speechTimeout.current);
    }
    setStep('listening');
    setDetectedCommand('');
    setSystemResponse('');
    onClose();
  };

  const handleConfirm = () => {
    setStep('done');
    onResult?.(systemResponse);
    
    // Auto close after showing success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      transparent
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleClose}
              style={styles.closeButton}
            >
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {step === 'listening' && (
              <>
                <View style={styles.micContainer}>
                  <Animated.View
                    style={[
                      styles.micWave,
                      { 
                        transform: [{ scale: pulseAnim }],
                        opacity: waveAnim,
                      }
                    ]}
                  />
                  <View style={styles.micCircle}>
                    <Mic size={32} color={theme.colors.primary[600]} />
                  </View>
                </View>
                <Text style={styles.title}>Listening...</Text>
                <Text style={styles.subtitle}>Speak your command</Text>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'processing' && (
              <>
                <View style={styles.processingContainer}>
                  <Text style={styles.detectedCommand}>"{detectedCommand}"</Text>
                  <View style={styles.dotsContainer}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </>
            )}

            {step === 'confirmation' && (
              <>
                <ScrollView 
                  style={styles.confirmationScrollView}
                  contentContainerStyle={styles.confirmationContainer}
                >
                  <Text style={styles.detectedCommand}>"{detectedCommand}"</Text>
                  <Text style={styles.responseText}>{systemResponse}</Text>
                  
                  <View style={styles.booksList}>
                    {responseBooks.map((book, index) => (
                      <View key={book.id} style={styles.bookItem}>
                        <Image 
                          source={{ uri: book.coverUrl }}
                          style={styles.bookCover}
                          resizeMode="cover"
                        />
                        <View style={styles.bookInfo}>
                          <Text style={styles.bookTitle}>{book.title}</Text>
                          <Text style={styles.bookAuthor}>by {book.author}</Text>
                          {book.rating && (
                            <View style={styles.ratingContainer}>
                              <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
                              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
                              <Text style={styles.reviewsText}>
                                ({book.reviews?.toLocaleString()} reviews)
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.confirmationButtons}>
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={handleConfirm}
                    >
                      <Text style={styles.confirmButtonText}>View All Results</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setStep('listening')}
                    >
                      <Text style={styles.cancelButtonText}>Try Again</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}

            {step === 'done' && (
              <>
                <View style={styles.doneContainer}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                  <Text style={styles.title}>Got it!</Text>
                  <Text style={styles.subtitle}>Taking you there...</Text>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  micContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  micWave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: theme.colors.primary[100],
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    color: theme.colors.neutral[600],
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.neutral[900],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  processingContainer: {
    alignItems: 'center',
  },
  detectedCommand: {
    fontFamily: 'Merriweather-Regular',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary[600],
    opacity: 0.3,
  },
  dot1: {
    animationKeyframes: 'bounce',
    animationDuration: '1s',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
  },
  dot2: {
    animationKeyframes: 'bounce',
    animationDuration: '1s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  dot3: {
    animationKeyframes: 'bounce',
    animationDuration: '1s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
  confirmationScrollView: {
    flex: 1,
    width: '100%',
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  responseText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    color: theme.colors.neutral[700],
    marginBottom: 24,
    textAlign: 'center',
  },
  booksList: {
    width: '100%',
    marginBottom: 24,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: theme.colors.neutral[200],
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[500],
    marginLeft: 4,
  },
  confirmationButtons: {
    width: '100%',
    gap: 12,
    paddingHorizontal: 24,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary[600],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: theme.colors.neutral[100],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    color: theme.colors.neutral[700],
  },
  doneContainer: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkMark: {
    fontSize: 40,
    color: theme.colors.primary[600],
  },
});

export { VoiceSearchModal }