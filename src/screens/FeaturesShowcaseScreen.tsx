import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, useTheme as usePaperTheme, Button, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';
import NotificationService from '../services/NotificationService';
import GamificationService from '../services/GamificationService';
import SocialService from '../services/SocialService';
import VideoCallService from '../services/VideoCallService';

const FeaturesShowcaseScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const [userStats, setUserStats] = useState<any>(null);
  const [communityStats, setCommunityStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stats = await GamificationService.getUserStats();
      setUserStats(stats);
      
      const communityData = await SocialService.getCommunityStats();
      setCommunityStats(communityData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!fontsLoaded) return null;

  const features = [
    {
      title: 'Push Notifications',
      icon: 'bell-ring',
      color: '#FF6B6B',
      backgroundColor: '#FFE5E5',
      description: 'Daily reminders, milestone celebrations, and motivational messages',
      actions: [
        { label: 'Schedule Daily Reminder', action: () => scheduleDailyReminder() },
        { label: 'Send Motivational Message', action: () => sendMotivationalMessage() },
        { label: 'Test Milestone Celebration', action: () => testMilestone() }
      ]
    },
    {
      title: 'Gamification',
      icon: 'trophy',
      color: '#4ECDC4',
      backgroundColor: '#E0F2F1',
      description: 'Points, badges, leaderboards, and achievement system',
      actions: [
        { label: 'Add Points', action: () => addPoints() },
        { label: 'Check Achievements', action: () => checkAchievements() },
        { label: 'View Leaderboard', action: () => viewLeaderboard() }
      ]
    },
    {
      title: 'Social Features',
      icon: 'account-group',
      color: '#45B7D1',
      backgroundColor: '#E3F2FD',
      description: 'Anonymous community posts, likes, comments, and support',
      actions: [
        { label: 'Create Post', action: () => createCommunityPost() },
        { label: 'View Community Stats', action: () => viewCommunityStats() },
        { label: 'Search Posts', action: () => searchPosts() }
      ]
    },
    {
      title: 'Video Calls',
      icon: 'video',
      color: '#96CEB4',
      backgroundColor: '#E8F5E8',
      description: 'One-on-one support sessions with professionals',
      actions: [
        { label: 'Book Session', action: () => bookSupportSession() },
        { label: 'Emergency Support', action: () => emergencySupport() },
        { label: 'View Sessions', action: () => viewSessions() }
      ]
    }
  ];

  const scheduleDailyReminder = async () => {
    try {
      await NotificationService.requestPermissions();
      await NotificationService.scheduleDailyReminder(9, 0); // 9 AM daily
      Alert.alert('Success', 'Daily reminder scheduled for 9:00 AM!');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  const sendMotivationalMessage = async () => {
    try {
      await NotificationService.scheduleMotivationalReminder();
      Alert.alert('Success', 'Motivational message sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const testMilestone = async () => {
    try {
      await NotificationService.scheduleMilestoneCelebration(30);
      Alert.alert('Success', '30-day milestone celebration sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send milestone');
    }
  };

  const addPoints = async () => {
    try {
      const newStats = await GamificationService.addPoints(50, 'Feature testing');
      setUserStats(newStats);
      Alert.alert('Success', 'Added 50 points!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add points');
    }
  };

  const checkAchievements = async () => {
    try {
      const achievements = await GamificationService.getRecentAchievements();
      const nextAchievements = await GamificationService.getNextAchievements();
      
      Alert.alert(
        'Achievements',
        `Recent: ${achievements.length}\nNext: ${nextAchievements.length} available`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load achievements');
    }
  };

  const viewLeaderboard = async () => {
    try {
      const leaderboard = await GamificationService.getLeaderboard();
      Alert.alert(
        'Leaderboard',
        `Top ${Math.min(leaderboard.length, 5)} users:\n` +
        leaderboard.slice(0, 5).map((entry, index) => 
          `${index + 1}. ${entry.username} - ${entry.points} pts`
        ).join('\n')
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load leaderboard');
    }
  };

  const createCommunityPost = async () => {
    try {
      const post = await SocialService.createPost(
        'user_123',
        'This is a test post from the features showcase! Stay strong everyone! 💪',
        'motivation',
        true,
        ['test', 'motivation'],
        'positive'
      );
      Alert.alert('Success', 'Community post created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const viewCommunityStats = () => {
    if (communityStats) {
      Alert.alert(
        'Community Stats',
        `Posts: ${communityStats.totalPosts}\n` +
        `Comments: ${communityStats.totalComments}\n` +
        `Likes: ${communityStats.totalLikes}\n` +
        `Active Users: ${communityStats.activeUsers}`
      );
    }
  };

  const searchPosts = async () => {
    try {
      const posts = await SocialService.searchPosts('motivation');
      Alert.alert('Search Results', `Found ${posts.length} posts about motivation`);
    } catch (error) {
      Alert.alert('Error', 'Failed to search posts');
    }
  };

  const bookSupportSession = async () => {
    try {
      const supporters = await VideoCallService.getAvailableSupporters();
      if (supporters.length > 0) {
        const session = await VideoCallService.bookSession(
          'user_123',
          supporters[0].id,
          new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          'regular',
          'medium'
        );
        Alert.alert('Success', `Session booked with ${supporters[0].name}!`);
      } else {
        Alert.alert('No Supporters', 'No supporters available at the moment');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book session');
    }
  };

  const emergencySupport = async () => {
    try {
      const session = await VideoCallService.requestEmergencySupport('user_123');
      Alert.alert('Emergency Support', 'Emergency support session created!');
    } catch (error) {
      Alert.alert('Error', 'No crisis supporters available');
    }
  };

  const viewSessions = async () => {
    try {
      const sessions = await VideoCallService.getUserSessions('user_123');
      Alert.alert('Sessions', `You have ${sessions.length} sessions`);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sessions');
    }
  };

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      showsVerticalScrollIndicator={true}
      bounces={false}
      overScrollMode="never"
      nestedScrollEnabled={true}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="star" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>New Features</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          Explore the latest features we've added to support your recovery journey.
        </Paragraph>
      </View>

      {/* User Stats Card */}
      {userStats && (
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Your Progress</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
                <Title style={[styles.statValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {userStats.totalPoints}
                </Title>
                <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Points
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="trophy" size={24} color={theme.colors.primary} />
                <Title style={[styles.statValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {userStats.level}
                </Title>
                <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Level
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={24} color={theme.colors.primary} />
                <Title style={[styles.statValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {userStats.currentStreak}
                </Title>
                <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Day Streak
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="medal" size={24} color={theme.colors.primary} />
                <Title style={[styles.statValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {userStats.achievements.filter((a: any) => a.unlocked).length}
                </Title>
                <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Achievements
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Features Grid */}
      {features.map((feature, index) => (
        <Card key={feature.title} style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <View style={[styles.featureIcon, { backgroundColor: feature.backgroundColor }]}>
                <MaterialCommunityIcons name={feature.icon as any} size={32} color={feature.color} />
              </View>
              <View style={styles.featureInfo}>
                <Title style={[styles.featureTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {feature.title}
                </Title>
                <Paragraph style={[styles.featureDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {feature.description}
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              {feature.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  mode="outlined"
                  onPress={action.action}
                  style={[styles.actionButton, { borderColor: feature.color }]}
                  labelStyle={[styles.actionButtonText, { fontFamily: 'Inter_400Regular', color: feature.color }]}
                >
                  {action.label}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Community Stats */}
      {communityStats && (
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Community Activity</Title>
            <View style={styles.communityStats}>
              <View style={styles.communityStat}>
                <MaterialCommunityIcons name="post" size={20} color={theme.colors.primary} />
                <Paragraph style={[styles.communityStatText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
                  {communityStats.totalPosts} Posts
                </Paragraph>
              </View>
              <View style={styles.communityStat}>
                <MaterialCommunityIcons name="comment" size={20} color={theme.colors.primary} />
                <Paragraph style={[styles.communityStatText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
                  {communityStats.totalComments} Comments
                </Paragraph>
              </View>
              <View style={styles.communityStat}>
                <MaterialCommunityIcons name="heart" size={20} color={theme.colors.primary} />
                <Paragraph style={[styles.communityStatText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
                  {communityStats.totalLikes} Likes
                </Paragraph>
              </View>
              <View style={styles.communityStat}>
                <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.primary} />
                <Paragraph style={[styles.communityStatText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
                  {communityStats.activeUsers} Active Users
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Bottom Spacer */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}>
      <Content />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  scroll: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  mainDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
  },
  communityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  communityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  communityStatText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default FeaturesShowcaseScreen; 