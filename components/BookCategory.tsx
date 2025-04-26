import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { Book } from '@/types/book';
import { theme } from '@/constants/theme';

interface BookCategoryProps {
  title: string;
  books: Book[];
}

export function BookCategory({ title, books }: BookCategoryProps) {
  const router = useRouter();
  
  // Prefetch images
  useEffect(() => {
    const prefetchImages = async () => {
      const imagePromises = books.map(book => 
        Image.prefetch(book.coverUrl)
      );
      await Promise.all(imagePromises);
    };
    
    prefetchImages();
  }, [books]);
  
  const handleViewAll = () => {
    router.push({
      pathname: '/(recommendations)',
      params: { category: title }
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={handleViewAll}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksContainer}
        removeClippedSubviews={false}
      >
        {books.map((book) => (
          <TouchableOpacity 
            key={book.id}
            style={styles.bookItem}
            onPress={() => router.push(`/(book-details)/${book.id}`)}
          >
            <Image 
              source={{ uri: book.coverUrl }}
              style={styles.bookCover}
              resizeMode="cover"
              loading="eager"
            />
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[600],
    marginRight: 4,
  },
  booksContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  bookItem: {
    width: 120,
    marginRight: 16,
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.neutral[200],
  },
  bookTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[600],
  },
});