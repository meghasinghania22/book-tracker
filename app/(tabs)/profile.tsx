import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Settings, Award, Book, ChartBar as BarChart2, Heart } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  // Mock user data
  const user = {
    name: 'Emily Johnson',
    joinDate: 'Member since January 2025',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    booksRead: 38,
    reviewsWritten: 17,
    favoriteGenres: ['Fantasy', 'Science Fiction', 'Literary Fiction'],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={styles.headerTitle}>Profile</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={22} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userJoinDate}>{user.joinDate}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.booksRead}</Text>
              <Text style={styles.statLabel}>Books Read</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.reviewsWritten}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Favorite Genres</Text>
          <View style={styles.genresContainer}>
            {user.favoriteGenres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Book size={22} color={theme.colors.primary[600]} />
            <Text style={styles.menuItemText}>Reading Lists</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Award size={22} color={theme.colors.primary[600]} />
            <Text style={styles.menuItemText}>Achievements</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <BarChart2 size={22} color={theme.colors.primary[600]} />
            <Text style={styles.menuItemText}>Reading Insights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Heart size={22} color={theme.colors.primary[600]} />
            <Text style={styles.menuItemText}>Favorite Authors</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reading Activity</Text>
          
          {/* Mock activity chart - in a real app, we'd use a proper chart library */}
          <View style={styles.activityChart}>
            <View style={styles.chartBars}>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 60 }]} />
                <Text style={styles.chartLabel}>Jan</Text>
              </View>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 40 }]} />
                <Text style={styles.chartLabel}>Feb</Text>
              </View>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 80 }]} />
                <Text style={styles.chartLabel}>Mar</Text>
              </View>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 70 }]} />
                <Text style={styles.chartLabel}>Apr</Text>
              </View>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 90 }]} />
                <Text style={styles.chartLabel}>May</Text>
              </View>
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 50 }]} />
                <Text style={styles.chartLabel}>Jun</Text>
              </View>
            </View>
            <Text style={styles.chartCaption}>Books read per month in 2025</Text>
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
  settingsButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
    color: theme.colors.text,
    marginBottom: 4,
  },
  userJoinDate: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 22,
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
    height: '80%',
    backgroundColor: theme.colors.neutral[300],
    marginHorizontal: 16,
  },
  sectionContainer: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontFamily: 'SourceSansPro-SemiBold',
    color: theme.colors.primary[700],
    fontSize: 14,
  },
  menuContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  menuItemText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 16,
  },
  activityChart: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 8,
  },
  chartBarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  chartBar: {
    width: 24,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[600],
  },
  chartCaption: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginTop: 8,
  },
});