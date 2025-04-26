import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

interface ShelfSelectorProps {
  shelves: string[];
  selectedShelf: string;
  onSelectShelf: (shelf: string) => void;
}

export function ShelfSelector({ shelves, selectedShelf, onSelectShelf }: ShelfSelectorProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {shelves.map((shelf) => (
          <TouchableOpacity
            key={shelf}
            style={[
              styles.shelfButton,
              selectedShelf === shelf && styles.selectedShelfButton
            ]}
            onPress={() => onSelectShelf(shelf)}
          >
            <Text
              style={[
                styles.shelfButtonText,
                selectedShelf === shelf && styles.selectedShelfButtonText
              ]}
            >
              {shelf}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  shelfButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    marginRight: 8,
  },
  selectedShelfButton: {
    backgroundColor: theme.colors.primary[600],
  },
  shelfButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  selectedShelfButtonText: {
    color: '#fff',
  },
});