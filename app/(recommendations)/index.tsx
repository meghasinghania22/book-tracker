import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Search, X, SlidersHorizontal } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { BookList } from '@/components/BookList';
import { FilterSheet } from '@/components/FilterSheet';
import { mockBooksData } from '@/data/mockBooks';

const quickFilters = {
  genres: ['Fiction', 'Fantasy', 'Science Fiction', 'Mystery'],
  ratings: [4.5, 4.0],
};

export default function RecommendationsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    rating: null,
    language: null,
    publishedDate: null,
  });

  // Filter books based on category and other filters
  const filteredBooks = useMemo(() => {
    let result = [...mockBooksData];

    // Apply category filter if provided
    if (category) {
      switch (category) {
        case 'Recommended For You':
          // Apply recommendation logic (e.g., based on user preferences)
          break;
        case 'New Releases':
          result = result.sort((a, b) => {
            const dateA = new Date(a.publishedDate || '');
            const dateB = new Date(b.publishedDate || '');
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'Popular in Fiction':
          result = result.filter(book => book.genre === 'Fiction')
            .sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'Award Winners':
          // In a real app, you would filter by award-winning books
          result = result.filter(book => (book.rating || 0) >= 4.5);
          break;
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    // Apply genre filters
    if (activeFilters.genres.length > 0) {
      result = result.filter(book => 
        book.genre && activeFilters.genres.includes(book.genre)
      );
    }

    // Apply rating filter
    if (activeFilters.rating) {
      result = result.filter(book => 
        book.rating && book.rating >= activeFilters.rating
      );
    }

    // Apply language filter
    if (activeFilters.language) {
      result = result.filter(book => 
        book.language === activeFilters.language
      );
    }

    // Apply published date filter
    if (activeFilters.publishedDate) {
      const now = new Date();
      const getDateLimit = (value: string) => {
        const months = {
          '3m': 3,
          '6m': 6,
          '1y': 12,
          '2y': 24,
          '5y': 60,
        }[value] || 0;
        
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        return date;
      };

      const dateLimit = getDateLimit(activeFilters.publishedDate);
      result = result.filter(book => {
        if (!book.publishedDate) return false;
        const publishDate = new Date(book.publishedDate);
        return publishDate >= dateLimit;
      });
    }

    return result;
  }, [mockBooksData, category, searchQuery, activeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleQuickFilter = (type: 'genres' | 'ratings', value: string | number) => {
    setActiveFilters(prev => {
      if (type === 'genres') {
        const genres = prev.genres.includes(value as string)
          ? prev.genres.filter(g => g !== value)
          : [...prev.genres, value as string];
        return { ...prev, genres };
      } else {
        const rating = prev.rating === value ? null : value as number;
        return { ...prev, rating };
      }
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter !== null
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>{category || 'Recommended For You'}</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.fixedContent}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.neutral[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books, authors..."
              placeholderTextColor={theme.colors.neutral[400]}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={20} color={theme.colors.neutral[400]} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(true)}
          >
            <SlidersHorizontal size={16} color={theme.colors.primary[600]} />
            <Text style={styles.filterButtonText}>All Filters</Text>
          </TouchableOpacity>

          {quickFilters.genres.map(genre => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.filterTag,
                activeFilters.genres.includes(genre) && styles.filterTagActive
              ]}
              onPress={() => toggleQuickFilter('genres', genre)}
            >
              <Text style={[
                styles.filterTagText,
                activeFilters.genres.includes(genre) && styles.filterTagTextActive
              ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}

          {quickFilters.ratings.map(rating => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.filterTag,
                activeFilters.rating === rating && styles.filterTagActive
              ]}
              onPress={() => toggleQuickFilter('ratings', rating)}
            >
              <Text style={[
                styles.filterTagText,
                activeFilters.rating === rating && styles.filterTagTextActive
              ]}>
                ★ {rating.toFixed(1)}+
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {hasActiveFilters && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.activeFiltersContainer}
            contentContainerStyle={styles.activeFiltersContent}
          >
            {activeFilters.genres.map(genre => (
              <View key={genre} style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>{genre}</Text>
                <TouchableOpacity
                  onPress={() => toggleQuickFilter('genres', genre)}
                >
                  <X size={16} color={theme.colors.primary[600]} />
                </TouchableOpacity>
              </View>
            ))}
            {activeFilters.rating && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>★ {activeFilters.rating}+</Text>
                <TouchableOpacity
                  onPress={() => toggleQuickFilter('ratings', activeFilters.rating)}
                >
                  <X size={16} color={theme.colors.primary[600]} />
                </TouchableOpacity>
              </View>
            )}
            {activeFilters.language && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>{activeFilters.language}</Text>
                <TouchableOpacity
                  onPress={() => setActiveFilters(prev => ({ ...prev, language: null }))}
                >
                  <X size={16} color={theme.colors.primary[600]} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.listContainer}>
        <BookList 
          books={filteredBooks}
          layout="list"
          emptyMessage="No books found matching your criteria"
        />
      </View>

      <FilterSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filters={activeFilters}
        onApplyFilters={handleFilterChange}
      />
    </SafeAreaView>
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
    fontSize: 20,
    color: theme.colors.text,
  },
  headerButton: {
    padding: 8,
  },
  fixedContent: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
    zIndex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  clearButton: {
    padding: 8,
  },
  filtersContainer: {
    maxHeight: 48,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    gap: 6,
  },
  filterButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[600],
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  filterTagActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  filterTagText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  filterTagTextActive: {
    color: '#fff',
  },
  activeFiltersContainer: {
    maxHeight: 48,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
  },
  activeFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[200],
    gap: 8,
  },
  activeFilterTagText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[700],
  },
  listContainer: {
    flex: 1,
  },
});