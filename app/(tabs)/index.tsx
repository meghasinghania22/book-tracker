import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Play, Pause, Clock, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { ProgressBar } from '@/components/ProgressBar';
import { ReadingTimer } from '@/components/ReadingTimer';
import { mockBooksData } from '@/data/mockBooks';

// Get currently reading books
const currentlyReading = mockBooksData.filter(
  (book) => book.shelf === 'Currently Reading'
);

export default function HomeScreen() {
  const router = useRouter();
  const [timerActive, setTimerActive] = useState(false);
  const activeBook = currentlyReading[0] || null;

  const handleToggleTimer = () => {
    setTimerActive(!timerActive);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={styles.headerTitle}>Reading Now</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeBook ? (
          <View style={styles.activeBookContainer}>
            <Image
              source={{ uri: activeBook.coverUrl }}
              style={styles.bookCover}
              resizeMode="cover"
            />

            <View style={styles.bookInfoContainer}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {activeBook.title}
              </Text>
              <Text style={styles.bookAuthor}>{activeBook.author}</Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>
                    Page {activeBook.currentPage} of {activeBook.totalPages}
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round(
                      (activeBook.currentPage / activeBook.totalPages) * 100
                    )}
                    %
                  </Text>
                </View>
                <ProgressBar
                  progress={activeBook.currentPage / activeBook.totalPages}
                />
              </View>

              <ReadingTimer
                isActive={timerActive}
                elapsedTime={activeBook.readingTime || 0}
              />

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleToggleTimer}
                >
                  {timerActive ? (
                    <Pause size={20} color="#fff" />
                  ) : (
                    <Play size={20} color="#fff" />
                  )}
                  <Text style={styles.primaryButtonText}>
                    {timerActive ? 'Pause Reading' : 'Start Reading'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Clock size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.actionButtonText}>Update Progress</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No books in progress</Text>
            <Text style={styles.emptyStateDescription}>
              Start reading a book by adding it to your "Currently Reading"
              shelf.
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.primaryButton,
                styles.emptyStateButton,
              ]}
              onPress={() => router.push('/(tabs)/discover')}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Find Books to Read</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reading Goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>2025 Reading Challenge</Text>
              <Text style={styles.goalProgress}>8 of 24 books</Text>
            </View>
            <ProgressBar progress={8 / 24} />
            <Text style={styles.goalDescription}>
              You're 2 books ahead of schedule! Keep it up!
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reading Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>38</Text>
              <Text style={styles.statLabel}>Books Read</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>9,436</Text>
              <Text style={styles.statLabel}>Pages</Text>
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
  header: {
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  activeBookContainer: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookInfoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[600],
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
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
  actionsContainer: {
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[600],
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  actionButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.primary[600],
    marginLeft: 8,
  },
  primaryButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
  },
  goalProgress: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 16,
    color: theme.colors.primary[600],
  },
  goalDescription: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 20,
    color: theme.colors.primary[700],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.neutral[300],
    marginHorizontal: 8,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: theme.colors.neutral[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    width: '100%',
    paddingVertical: 12,
  },
});
