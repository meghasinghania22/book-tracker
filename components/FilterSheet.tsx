import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '@/constants/theme';

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy',
  'Romance', 'Thriller', 'Horror', 'Biography', 'History',
  'Self-Help', 'Business', 'Poetry', 'Drama', 'Adventure'
];

const ratings = [4.5, 4.0, 3.5, 3.0];

const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese'];

const publishedDates = [
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'This year', value: '1y' },
  { label: 'Last 2 years', value: '2y' },
  { label: 'Last 5 years', value: '5y' },
];

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    genres: string[];
    rating: number | null;
    language: string | null;
    publishedDate: string | null;
  };
  onApplyFilters: (filters: any) => void;
}

export function FilterSheet({ visible, onClose, filters, onApplyFilters }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleGenreToggle = (genre: string) => {
    setLocalFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleRatingSelect = (rating: number) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? null : rating
    }));
  };

  const handleLanguageSelect = (language: string) => {
    setLocalFilters(prev => ({
      ...prev,
      language: prev.language === language ? null : language
    }));
  };

  const handleDateSelect = (date: string) => {
    setLocalFilters(prev => ({
      ...prev,
      publishedDate: prev.publishedDate === date ? null : date
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      genres: [],
      rating: null,
      language: null,
      publishedDate: null,
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genreGrid}>
                {genres.map(genre => (
                  <TouchableOpacity
                    key={genre}
                    style={[
                      styles.genreButton,
                      localFilters.genres.includes(genre) && styles.genreButtonActive
                    ]}
                    onPress={() => handleGenreToggle(genre)}
                  >
                    <Text style={[
                      styles.genreButtonText,
                      localFilters.genres.includes(genre) && styles.genreButtonTextActive
                    ]}>
                      {genre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.ratingButtons}>
                {ratings.map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      localFilters.rating === rating && styles.ratingButtonActive
                    ]}
                    onPress={() => handleRatingSelect(rating)}
                  >
                    <Text style={[
                      styles.ratingButtonText,
                      localFilters.rating === rating && styles.ratingButtonTextActive
                    ]}>
                      ★ {rating.toFixed(1)}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Language</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.languageContainer}
              >
                {languages.map(language => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.languageButton,
                      localFilters.language === language && styles.languageButtonActive
                    ]}
                    onPress={() => handleLanguageSelect(language)}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      localFilters.language === language && styles.languageButtonTextActive
                    ]}>
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Published Date</Text>
              <View style={styles.dateButtons}>
                {publishedDates.map(date => (
                  <TouchableOpacity
                    key={date.value}
                    style={[
                      styles.dateButton,
                      localFilters.publishedDate === date.value && styles.dateButtonActive
                    ]}
                    onPress={() => handleDateSelect(date.value)}
                  >
                    <Text style={[
                      styles.dateButtonText,
                      localFilters.publishedDate === date.value && styles.dateButtonTextActive
                    ]}>
                      {date.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  headerTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  genreButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  genreButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  genreButtonTextActive: {
    color: '#fff',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  ratingButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  ratingButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  ratingButtonTextActive: {
    color: '#fff',
  },
  languageContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    marginRight: 8,
  },
  languageButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  languageButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  dateButtons: {
    gap: 8,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    marginBottom: 8,
  },
  dateButtonActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  dateButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: theme.colors.neutral[700],
  },
  dateButtonTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.primary[600],
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary[600],
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});