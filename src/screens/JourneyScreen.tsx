import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const JourneyScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(25); // Default 25 minutes

  // Calendar state
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Relapse and craving tracking
  const [relapseDays, setRelapseDays] = useState([5, 12, 19]); // Days with relapses
  const [cravingDays, setCravingDays] = useState([3, 8, 15, 22]); // Days with strong cravings
  const [cleanDays, setCleanDays] = useState([1, 2, 4, 6, 7, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30]); // Clean days

  // Weather and alarm state
  const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny', icon: 'weather-sunny' });
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:00', label: 'Morning Motivation', active: true },
    { id: 2, time: '12:00', label: 'Lunch Break Check-in', active: true },
    { id: 3, time: '18:00', label: 'Evening Reflection', active: false },
  ]);

  // Milestone tracking
  const [daysWithoutGambling, setDaysWithoutGambling] = useState(7);
  const [totalSaved, setTotalSaved] = useState(15000); // in rupees
  const [streakGoal, setStreakGoal] = useState(30);

  const milestones = [
    { days: 1, title: 'First Day', description: 'You took the first step!', achieved: daysWithoutGambling >= 1, color: '#4CAF50' },
    { days: 7, title: 'Week Warrior', description: 'One week strong!', achieved: daysWithoutGambling >= 7, color: '#2196F3' },
    { days: 14, title: 'Fortnight Fighter', description: 'Two weeks of freedom!', achieved: daysWithoutGambling >= 14, color: '#FF9800' },
    { days: 30, title: 'Month Master', description: 'One month milestone!', achieved: daysWithoutGambling >= 30, color: '#9C27B0' },
    { days: 60, title: 'Two Month Titan', description: 'Two months of control!', achieved: daysWithoutGambling >= 60, color: '#E91E63' },
    { days: 90, title: 'Quarter Champion', description: 'Three months strong!', achieved: daysWithoutGambling >= 90, color: '#FF5722' },
    { days: 180, title: 'Half Year Hero', description: 'Six months of freedom!', achieved: daysWithoutGambling >= 180, color: '#607D8B' },
    { days: 365, title: 'Year Champion', description: 'One year of control!', achieved: daysWithoutGambling >= 365, color: '#FFD700' },
  ];

  const achievements = [
    { title: 'First Emergency Handled', description: 'Successfully managed a gambling urge', achieved: true, icon: 'shield-check', color: '#4CAF50' },
    { title: '₹10,000 Saved', description: 'Saved money that would have been lost', achieved: totalSaved >= 10000, icon: 'cash-multiple', color: '#FF9800' },
    { title: 'Support Group Joined', description: 'Connected with recovery community', achieved: true, icon: 'account-group', color: '#2196F3' },
    { title: 'Family Reconnected', description: 'Improved relationships with loved ones', achieved: false, icon: 'heart', color: '#E91E63' },
    { title: 'New Hobby Started', description: 'Found positive activities to replace gambling', achieved: false, icon: 'palette', color: '#9C27B0' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startTimer = () => {
    setTimerSeconds(timerMinutes * 60);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate();
      const isSelected = day === selectedDate.getDate();
      const isRelapse = relapseDays.includes(day);
      const isCraving = cravingDays.includes(day);
      const isClean = cleanDays.includes(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.today,
            isSelected && styles.selectedDay,
            isRelapse && styles.relapseDay,
            isCraving && styles.cravingDay,
            isClean && styles.cleanDay
          ]}
          onPress={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <Paragraph style={[
            styles.calendarDayText,
            { fontFamily: 'Inter_400Regular', color: theme.colors.text },
            isToday && styles.todayText,
            isSelected && styles.selectedDayText,
            isRelapse && styles.relapseText,
            isCraving && styles.cravingText,
            isClean && styles.cleanText
          ]}>
            {day}
          </Paragraph>
        </TouchableOpacity>
      );
    }

    return days;
  };

  if (!fontsLoaded) return null;

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      bounces={false}
      overScrollMode="never"
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={styles.thinHeader}>
          <MaterialCommunityIcons name="map-marker-path" size={32} color={theme.colors.primary} />
          <Title style={[styles.thinTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Journal</Title>
          <Paragraph style={[styles.thinSubtitle, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Track your progress and celebrate your milestones.</Paragraph>
        </Card.Content>
      </Card>

      {/* Timer Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Focus Timer</Title>
          <View style={[styles.timerContainer, { backgroundColor: '#E3F2FD' }]}>
            <View style={styles.timerDisplay}>
              <Title style={[styles.timerText, { fontFamily: 'Inter_700Bold', color: '#2196F3' }]}>
                {formatTime(timerSeconds)}
              </Title>
            </View>
            <View style={styles.timerControls}>
              {!timerRunning ? (
                <Button 
                  mode="contained" 
                  icon="play" 
                  onPress={startTimer}
                  buttonColor="#4CAF50"
                  style={styles.timerButton}
                >
                  Start
                </Button>
              ) : (
                <View style={styles.timerButtonRow}>
                  <Button 
                    mode="outlined" 
                    icon="pause" 
                    onPress={pauseTimer}
                    style={[styles.timerButton, { borderColor: '#FF9800' }]}
                    textColor="#FF9800"
                  >
                    Pause
                  </Button>
                  <Button 
                    mode="outlined" 
                    icon="stop" 
                    onPress={stopTimer}
                    style={[styles.timerButton, { borderColor: '#F44336' }]}
                    textColor="#F44336"
                  >
                    Stop
                  </Button>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Calendar Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Milestones Calendar</Title>
          <View style={[styles.calendarContainer, { backgroundColor: '#F5F5F5' }]}>
            <View style={styles.calendarHeader}>
              <Paragraph style={[styles.calendarMonth, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Paragraph>
            </View>
            <View style={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <View key={day} style={styles.calendarHeaderDay}>
                  <Paragraph style={[styles.calendarHeaderText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    {day}
                  </Paragraph>
                </View>
              ))}
              {renderCalendar()}
            </View>
            {/* Calendar Legend */}
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Paragraph style={[styles.legendText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Clean Day</Paragraph>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Paragraph style={[styles.legendText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Craving</Paragraph>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF5722' }]} />
                <Paragraph style={[styles.legendText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Relapse</Paragraph>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
                <Paragraph style={[styles.legendText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Today</Paragraph>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Enhanced Days Without Gambling */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Your Recovery Journey</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-check" size={32} color="#4CAF50" />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: '#4CAF50' }]}>{daysWithoutGambling}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Days Free</Paragraph>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cash" size={32} color="#FF9800" />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: '#FF9800' }]}>₹{totalSaved.toLocaleString()}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Money Saved</Paragraph>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="target" size={32} color="#2196F3" />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: '#2196F3' }]}>{streakGoal}</Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Goal (Days)</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Journal</Title>
          <Button 
            mode="contained" 
            icon="notebook" 
            style={styles.button} 
            onPress={() => navigation.navigate('MyJournal')}
            buttonColor={theme.colors.primary}
          >
            Add Entry
          </Button>
        </Card.Content>
      </Card>

      {/* Enhanced Milestones */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Milestones</Title>
          <View style={styles.milestonesContainer}>
            {milestones.map((milestone, index) => (
              <View key={index} style={[styles.milestoneItem, { backgroundColor: milestone.achieved ? milestone.color + '20' : '#f5f5f5' }]}>
                <View style={[styles.milestoneIcon, { backgroundColor: milestone.achieved ? milestone.color : '#ccc' }]}>
                  <MaterialCommunityIcons 
                    name={milestone.achieved ? 'check-circle' : 'circle-outline'} 
                    size={24} 
                    color={milestone.achieved ? '#fff' : '#666'} 
                  />
                </View>
                <View style={styles.milestoneText}>
                  <Title style={[styles.milestoneTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{milestone.title}</Title>
                  <Paragraph style={[styles.milestoneDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{milestone.description}</Paragraph>
                </View>
                <Chip 
                  mode="outlined" 
                  style={[styles.milestoneChip, { borderColor: milestone.color }]}
                >
                  {milestone.days} days
                </Chip>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Enhanced Achievements */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Achievements</Title>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItem, { backgroundColor: achievement.achieved ? achievement.color + '20' : '#f5f5f5' }]}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.achieved ? achievement.color : '#ccc' }]}>
                  <MaterialCommunityIcons 
                    name={achievement.icon as any} 
                    size={24} 
                    color={achievement.achieved ? '#fff' : '#666'} 
                  />
                </View>
                <View style={styles.achievementText}>
                  <Title style={[styles.achievementTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{achievement.title}</Title>
                  <Paragraph style={[styles.achievementDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{achievement.description}</Paragraph>
                </View>
                <MaterialCommunityIcons 
                  name={achievement.achieved ? 'check-circle' : 'clock-outline'} 
                  size={24} 
                  color={achievement.achieved ? achievement.color : '#ccc'} 
                />
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>


    </ScrollView>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}>
      <Content />
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
    paddingBottom: 140,
    flexGrow: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  button: {
    marginVertical: 4,
  },
  // Timer styles
  timerContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timerDisplay: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 56,
    paddingVertical: 8,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerButton: {
    marginHorizontal: 8,
  },
  timerButtonRow: {
    flexDirection: 'row',
  },
  // Calendar styles
  calendarContainer: {
    marginVertical: 8,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 18,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarHeaderDay: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calendarDayText: {
    fontSize: 14,
  },
  today: {
    backgroundColor: '#1976d2',
    borderRadius: 20,
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#ff9800',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  relapseDay: {
    backgroundColor: '#FFCDD2',
    borderRadius: 20,
  },
  relapseText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  cravingDay: {
    backgroundColor: '#FFE0B2',
    borderRadius: 20,
  },
  cravingText: {
    color: '#F57C00',
    fontWeight: 'bold',
  },
  cleanDay: {
    backgroundColor: '#C8E6C9',
    borderRadius: 20,
  },
  cleanText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  // New styles for enhanced sections
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 28,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  milestonesContainer: {
    marginTop: 16,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneText: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  milestoneDesc: {
    fontSize: 12,
  },
  milestoneChip: {
    marginTop: 8,
  },
  achievementsContainer: {
    marginTop: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
  },
  // New styles for calendar legend
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  // New styles for weather and alarm sections
  thinHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  thinTitle: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 2,
  },
  thinSubtitle: {
    fontSize: 14,
  },
  weatherContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherText: {
    marginLeft: 12,
  },
  weatherTemp: {
    fontSize: 36,
  },
  weatherCondition: {
    fontSize: 16,
  },
  weatherTip: {
    fontSize: 14,
    textAlign: 'center',
  },
  alarmsContainer: {
    marginTop: 16,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  alarmLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmText: {
    marginLeft: 12,
  },
  alarmTime: {
    fontSize: 16,
  },
  alarmLabel: {
    fontSize: 12,
  },
});

export default JourneyScreen; 