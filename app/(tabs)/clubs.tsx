import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Users, ChevronRight, Calendar } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { mockClubs, recommendedClubs } from '@/data/mockClubs';

export default function ClubsScreen() {
  const [activeTab, setActiveTab] = useState<'my-clubs' | 'discover'>('my-clubs');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={styles.headerTitle}>Book Clubs</Text>
          ),
          headerStyle: styles.header,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-clubs' && styles.activeTab]}
          onPress={() => setActiveTab('my-clubs')}
        >
          <Text style={[styles.tabText, activeTab === 'my-clubs' && styles.activeTabText]}>
            My Clubs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'my-clubs' ? (
          <>
            {mockClubs.map(club => (
              <TouchableOpacity key={club.id} style={styles.clubCard}>
                <View style={styles.clubHeader}>
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{club.name}</Text>
                    <View style={styles.membersContainer}>
                      <Users size={16} color={theme.colors.neutral[600]} />
                      <Text style={styles.membersText}>{club.members} members</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={theme.colors.neutral[400]} />
                </View>

                {club.currentBook && (
                  <View style={styles.currentBookContainer}>
                    <Image
                      source={{ uri: club.currentBook.coverUrl }}
                      style={styles.bookCover}
                    />
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle}>{club.currentBook.title}</Text>
                      <Text style={styles.bookAuthor}>by {club.currentBook.author}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.clubFooter}>
                  {club.nextMeeting && (
                    <View style={styles.meetingInfo}>
                      <Calendar size={16} color={theme.colors.primary[600]} />
                      <Text style={styles.meetingText}>
                        Next meeting: {formatDate(club.nextMeeting)}
                      </Text>
                    </View>
                  )}
                  {(club.unreadMessages ?? 0) > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{club.unreadMessages} unread</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.recommendedContainer}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            {recommendedClubs.map(club => (
              <TouchableOpacity key={club.id} style={styles.recommendedCard}>
                <Image
                  source={{ uri: club.coverUrl }}
                  style={styles.recommendedCover}
                />
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedName}>{club.name}</Text>
                  <View style={styles.membersContainer}>
                    <Users size={16} color={theme.colors.neutral[600]} />
                    <Text style={styles.membersText}>{club.members} members</Text>
                  </View>
                  <Text style={styles.recommendedDescription}>
                    {club.description}
                  </Text>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Club</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[600],
  },
  tabText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.neutral[600],
  },
  activeTabText: {
    color: theme.colors.primary[600],
  },
  clubCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 4,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginLeft: 6,
  },
  currentBookContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bookTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  bookAuthor: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
  },
  clubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  meetingText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.primary[600],
    marginLeft: 6,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  unreadText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  recommendedContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    overflow: 'hidden',
  },
  recommendedCover: {
    width: 120,
    height: '100%',
  },
  recommendedInfo: {
    flex: 1,
    padding: 16,
  },
  recommendedName: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  recommendedDescription: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginTop: 8,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: theme.colors.primary[600],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
});