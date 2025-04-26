import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Search, X, Camera } from 'lucide-react-native';
import { BookList } from '@/components/BookList';
import { theme } from '@/constants/theme';
import { mockBooksData } from '@/data/mockBooks';
import { BookCategory } from '@/components/BookCategory';

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Mock categories
  const categories = [
    { title: 'Recommended For You', books: mockBooksData.slice(0, 6) },
    { title: 'New Releases', books: mockBooksData.slice(6, 12) },
    { title: 'Popular in Fiction', books: mockBooksData.slice(3, 9) },
    { title: 'Award Winners', books: mockBooksData.slice(8, 14) },
  ];

  const handleSearch = (query) => {
    setSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const results = mockBooksData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleScanPress = () => {
    router.push('/scan');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={styles.headerTitle}>Discover</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.colors.neutral[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors..."
            placeholderTextColor={theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length > 2) {
                handleSearch(text);
              } else if (text.length === 0) {
                clearSearch();
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleScanPress} style={styles.scanButton}>
            <Camera size={20} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary[600]} size="large" />
        </View>
      ) : searchQuery.length > 2 ? (
        <BookList 
          books={searchResults}
          layout="list"
          emptyMessage="No books found. Try a different search term."
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookCategory 
              title={item.title}
              books={item.books}
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  scanButton: {
    padding: 8,
    marginLeft: 4,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.neutral[200],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesList: {
    paddingBottom: 24,
  },
});