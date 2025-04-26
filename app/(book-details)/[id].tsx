import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  BookOpen, 
  Check,
  Plus,
  Star
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { ProgressBar } from '@/components/ProgressBar';
import { mockBooksData } from '@/data/mockBooks';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const book = mockBooksData.find(b => b.id.toString() === id);
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            ),
            headerTitle: '',
            headerTransparent: true,
          }}
        />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Book not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart 
                  size={24} 
                  color={isFavorite ? theme.colors.secondary[500] : theme.colors.text}
                  fill={isFavorite ? theme.colors.secondary[500] : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share2 size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: book.coverUrl }}
            style={styles.bookCover}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>
          
          {book.rating && (
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  color={theme.colors.warning}
                  fill={index < Math.floor(book.rating) ? theme.colors.warning : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({book.reviews || 0} reviews)</Text>
            </View>
          )}
          
          <View style={styles.buttonsContainer}>
            {book.shelf === 'Currently Reading' ? (
              <>
                <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                  <BookOpen size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Continue Reading</Text>
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>
                      {book.currentPage} of {book.totalPages} pages
                    </Text>
                    <Text style={styles.progressPercentage}>
                      {Math.round((book.currentPage / book.totalPages) * 100)}%
                    </Text>
                  </View>
                  <ProgressBar 
                    progress={book.currentPage / book.totalPages}
                  />
                </View>
              </>
            ) : book.shelf ? (
              <>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                  <Check size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.secondaryButtonText}>On "{book.shelf}" Shelf</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                  <BookOpen size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Start Reading</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                <Plus size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Add to Library</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pages</Text>
              <Text style={styles.detailValue}>{book.totalPages}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Genre</Text>
              <Text style={styles.detailValue}>{book.genre}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Published</Text>
              <Text style={styles.detailValue}>{book.publishedDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Publisher</Text>
              <Text style={styles.detailValue}>{book.publisher}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Language</Text>
              <Text style={styles.detailValue}>{book.language}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN</Text>
              <Text style={styles.detailValue}>{book.isbn}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  coverContainer: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 24,
  },
  bookCover: {
    width: 180,
    height: 270,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  detailsContainer: {
    padding: 24,
  },
  bookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    color: theme.colors.neutral[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 8,
  },
  reviewsText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[500],
    marginLeft: 4,
  },
  buttonsContainer: {
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[600],
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
  },
  primaryButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.primary[600],
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
  },
  progressPercentage: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[600],
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[700],
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  detailLabel: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.neutral[600],
    width: 100,
  },
  detailValue: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  backLink: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.primary[600],
  },
});