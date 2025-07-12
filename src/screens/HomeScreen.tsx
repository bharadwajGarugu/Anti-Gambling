import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, useTheme as usePaperTheme, Chip, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const [currentTime] = useState(new Date().getHours());
  const userName = "Warrior"; // Default name, can be made dynamic later
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { title: 'Add Journal Entry', icon: 'pencil-plus', action: () => navigation.navigate('MyJournal'), color: '#4CAF50', backgroundColor: '#E8F5E8' },
    { title: 'Urge Surfing', icon: 'waves', action: () => navigation.navigate('UrgeSurfing'), color: '#F44336', backgroundColor: '#FFEBEE' },
    { title: 'Trigger ID', icon: 'target', action: () => navigation.navigate('TriggerIdentification'), color: '#9C27B0', backgroundColor: '#F3E5F5' },
    { title: 'Success Stories', icon: 'trophy', action: () => navigation.navigate('SuccessStories'), color: '#4CAF50', backgroundColor: '#E8F5E8' },
    { title: 'Daily Motivation', icon: 'lightbulb-on-outline', action: () => navigation.navigate('Motivation'), color: '#FF9800', backgroundColor: '#FFF3E0' },
    { title: 'Community', icon: 'account-group-outline', action: () => navigation.navigate('Community'), color: '#2196F3', backgroundColor: '#E3F2FD' },
    { title: 'Emergency Help', icon: 'phone-alert-outline', action: () => navigation.navigate('EmergencyHelp'), color: '#F44336', backgroundColor: '#FFEBEE' },
  ];

  // Streak tracking state
  const [gamblingFreeDays, setGamblingFreeDays] = useState(0); // Start at 0 days
  const [lastRelapseDate, setLastRelapseDate] = useState<Date | null>(null);
  const [showRelapseDialog, setShowRelapseDialog] = useState(false);
  const [relapseReason, setRelapseReason] = useState('');
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [dailyMood, setDailyMood] = useState<'good' | 'okay' | 'bad'>('okay');
  const [dailyNotes, setDailyNotes] = useState('');

  const handleRelapse = () => {
    if (relapseReason.trim()) {
      setGamblingFreeDays(0);
      setLastRelapseDate(new Date());
      setRelapseReason('');
      setShowRelapseDialog(false);
      Alert.alert('Reset Complete', 'Your streak has been reset. Remember, relapse is part of recovery. Start fresh today!');
    } else {
      Alert.alert('Please Add Reason', 'Please add a reason for the relapse to help track patterns.');
    }
  };

  const handleDailyCheckIn = () => {
    if (dailyNotes.trim()) {
      setShowDailyCheckIn(false);
      setDailyNotes('');
      Alert.alert('Check-in Saved', 'Your daily check-in has been recorded. Keep up the great work!');
    } else {
      Alert.alert('Please Add Notes', 'Please add some notes about your day.');
    }
  };

  // In the HomeScreen component, add a useEffect to update progress stats when gamblingFreeDays changes
  const [progressStats, setProgressStats] = useState({
    days: gamblingFreeDays,
    moneySaved: gamblingFreeDays * 500,
    streak: gamblingFreeDays,
  });
  useEffect(() => {
    setProgressStats({
      days: gamblingFreeDays,
      moneySaved: gamblingFreeDays * 500,
      streak: gamblingFreeDays,
    });
  }, [gamblingFreeDays]);
  // Use progressStats.days, progressStats.moneySaved, progressStats.streak in the Your Progress section.

  if (!fontsLoaded) return null;

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
        <MaterialCommunityIcons name="home" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
          {getGreeting()}, {userName}!
        </Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          Stay strong on your recovery journey. Every day counts.
        </Paragraph>
      </View>

      {/* Gambling-Free Streak Tracker */}
      <Card style={[styles.streakCard, { backgroundColor: gamblingFreeDays >= 30 ? '#E8F5E8' : gamblingFreeDays >= 7 ? '#FFF3E0' : '#FFEBEE', marginBottom: 24 }]}>
        <Card.Content>
          <View style={styles.streakHeader}>
            <MaterialCommunityIcons 
              name={gamblingFreeDays >= 30 ? 'trophy' : gamblingFreeDays >= 7 ? 'fire' : 'heart'} 
              size={32} 
              color={gamblingFreeDays >= 30 ? '#4CAF50' : gamblingFreeDays >= 7 ? '#FF9800' : '#F44336'} 
            />
            <View style={styles.streakText}>
              <Title style={[styles.streakNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                {gamblingFreeDays}
              </Title>
              <Paragraph style={[styles.streakLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Days Without Gambling
              </Paragraph>
            </View>
          </View>
          
          <View style={styles.streakActions}>
            <Button 
              mode="contained" 
              onPress={() => setGamblingFreeDays(prev => prev + 1)}
              style={[styles.streakButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ fontFamily: 'Inter_700Bold' }}
            >
              ✅ Today Clean
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setShowRelapseDialog(true)}
              style={[styles.streakButton, { borderColor: '#F44336' }]}
              textColor="#F44336"
              labelStyle={{ fontFamily: 'Inter_400Regular' }}
            >
              ❌ Relapse
            </Button>
          </View>
          
          <View style={styles.streakActions}>
            <Button 
              mode="outlined" 
              onPress={() => setShowDailyCheckIn(true)}
              style={[styles.streakButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
              labelStyle={{ fontFamily: 'Inter_400Regular' }}
            >
              📝 Daily Check-in
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Your Progress Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card, marginBottom: 24 }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Your Progress</Title>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color={theme.colors.primary} />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{progressStats.days}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Days Free</Paragraph>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="cash" size={24} color={theme.colors.primary} />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">₹{progressStats.moneySaved.toLocaleString()}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Money Saved</Paragraph>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color={theme.colors.primary} />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{progressStats.streak}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Streak</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Quick Actions</Title>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.title}
                style={[styles.quickActionItem, { backgroundColor: action.backgroundColor }]}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <MaterialCommunityIcons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Paragraph style={[styles.quickActionText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
                  {action.title}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Daily Motivation */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Today's Motivation</Title>
          <View style={[styles.motivationContent, { backgroundColor: isDarkMode ? '#1B5E20' : '#E8F5E8' }]}>
            <MaterialCommunityIcons name="format-quote-open" size={24} color={isDarkMode ? '#A5D6A7' : '#4CAF50'} />
            <Paragraph style={[styles.motivationText, { fontFamily: 'Inter_400Regular', color: isDarkMode ? '#E8F5E8' : theme.colors.text }]}>
              "You are stronger than your urges. Every moment you choose not to gamble is a moment you choose yourself."
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Achievement Badge */}
      {gamblingFreeDays >= 7 && (
        <Card style={[styles.achievementCard, { backgroundColor: isDarkMode ? '#BF360C' : '#FFF3E0' }]}> 
          <Card.Content style={styles.achievementContent}>
            <MaterialCommunityIcons name="medal" size={32} color={isDarkMode ? '#FFCC02' : '#FF9800'} />
            <View style={styles.achievementText}>
              <Title style={[styles.achievementTitle, { fontFamily: 'Inter_700Bold', color: isDarkMode ? '#FFE0B2' : theme.colors.text }]}>Week Warrior!</Title>
              <Paragraph style={[styles.achievementDesc, { fontFamily: 'Inter_400Regular', color: isDarkMode ? '#FFCC80' : theme.colors.textSecondary }]}>You've completed your first week! Keep going strong.</Paragraph>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Bottom Spacer to ensure scrolling */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}>
      <Content />
      <Portal>
        <Dialog visible={showRelapseDialog} onDismiss={() => setShowRelapseDialog(false)}>
          <Dialog.Title>Relapse Detected</Dialog.Title>
          <Dialog.Content>
            <Paragraph>It seems you've had a relapse. Please add a reason for the relapse to help track patterns.</Paragraph>
            <TextInput
              label="Relapse Reason"
              value={relapseReason}
              onChangeText={setRelapseReason}
              mode="outlined"
              style={{ marginTop: 10 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRelapseDialog(false)}>Cancel</Button>
            <Button onPress={handleRelapse}>Confirm Relapse</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDailyCheckIn} onDismiss={() => setShowDailyCheckIn(false)}>
          <Dialog.Title>Daily Check-in</Dialog.Title>
          <Dialog.Content style={{ minWidth: 300, maxWidth: 400 }}>
            <Paragraph style={{ marginBottom: 8, fontSize: 16, textAlign: 'left', flexWrap: 'wrap' }}>
              How are you feeling today? Add some notes to your daily check-in. Share as much as you want—your thoughts, feelings, wins, struggles, or anything else. This is your safe space to reflect and grow.
            </Paragraph>
            <TextInput
              label="Mood (good, okay, bad)"
              value={dailyMood}
              onChangeText={(text) => setDailyMood(text as 'good' | 'okay' | 'bad')}
              mode="outlined"
              style={{ marginTop: 10, minWidth: 250 }}
            />
            <TextInput
              label="Notes"
              value={dailyNotes}
              onChangeText={setDailyNotes}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={{ marginTop: 10, minWidth: 250, maxWidth: 400, textAlignVertical: 'top' }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDailyCheckIn(false)}>Cancel</Button>
            <Button onPress={handleDailyCheckIn}>Save Check-in</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 180,
    flexGrow: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  mainDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  welcomeCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  thinWelcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thinGreeting: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  thinWelcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakChip: {
    backgroundColor: '#fff3e0',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  motivationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    marginLeft: 8,
    flex: 1,
  },
  achievementCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    opacity: 0.8,
  },
  streakCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakText: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 36,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
  },
  streakActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  streakButton: {
    width: '45%',
    borderRadius: 12,
  },
});

export default HomeScreen; 