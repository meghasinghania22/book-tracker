import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { BookList } from '@/components/BookList';
import { ShelfSelector } from '@/components/ShelfSelector';
import { theme } from '@/constants/theme';
import { mockBooksData } from '@/data/mockBooks';

const shelves = ['All Books', 'Currently Reading', 'Want to Read', 'Read', 'Favorites'];

export default function LibraryScreen() {
  const [selectedShelf, setSelectedShelf] = useState('All Books');
  
  // Filter books based on selected shelf
  const filteredBooks = selectedShelf === 'All Books' 
    ? mockBooksData 
    : mockBooksData.filter(book => book.shelf === selectedShelf);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={styles.headerTitle}>My Library</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
      />
      
      <ShelfSelector 
        shelves={shelves}
        selectedShelf={selectedShelf}
        onSelectShelf={setSelectedShelf}
      />
      
      <BookList 
        books={filteredBooks}
        layout="grid"
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
});