import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Book } from '@/types/book';
import { theme } from '@/constants/theme';

interface BookListProps {
  books: Book[];
  layout: 'grid' | 'list';
  emptyMessage?: string;
}

export function BookList({ books, layout, emptyMessage = 'No books found' }: BookListProps) {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const numColumns = layout === 'grid' ? 3 : 1;
  const bookWidth = layout === 'grid' 
    ? (screenWidth - 48) / 3 
    : screenWidth - 32;
  
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

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const renderBook = ({ item }: { item: Book }) => {
    if (layout === 'grid') {
      return (
        <TouchableOpacity 
          style={[styles.gridItem, { width: bookWidth }]}
          onPress={() => router.push(`/(book-details)/${item.id}`)}
        >
          <Image 
            source={{ uri: item.coverUrl }}
            style={[styles.gridCover, { width: bookWidth - 16, height: (bookWidth - 16) * 1.5 }]}
            resizeMode="cover"
            loading="eager"
          />
          <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.gridAuthor} numberOfLines={1}>{item.author}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.listItem}
          onPress={() => router.push(`/(book-details)/${item.id}`)}
        >
          <Image 
            source={{ uri: item.coverUrl }}
            style={styles.listCover}
            resizeMode="cover"
            loading="eager"
          />
          <View style={styles.listContent}>
            <Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.listAuthor}>{item.author}</Text>
            <Text style={styles.listDescription} numberOfLines={2}>
              {item.description?.substring(0, 100)}...
            </Text>
            {item.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.star,
                        { backgroundColor: index < Math.floor(item.rating) 
                          ? theme.colors.warning 
                          : theme.colors.neutral[300] 
                        }
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <FlatList
      data={books}
      renderItem={renderBook}
      keyExtractor={item => item.id.toString()}
      numColumns={numColumns}
      key={layout}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={layout === 'grid' ? styles.gridContainer : styles.listContainer}
      removeClippedSubviews={false}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  gridItem: {
    marginBottom: 24,
    padding: 8,
  },
  gridCover: {
    borderRadius: 8,
    marginBottom: 8,
  },
  gridTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  gridAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[600],
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  listCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  listContent: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  listAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginBottom: 8,
  },
  listDescription: {
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
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[500],
    textAlign: 'center',
  },
});

export { BookList }