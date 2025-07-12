import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Linking, Alert, TextInput } from 'react-native';
import { Card, Title, Paragraph, useTheme as usePaperTheme, Chip, Button, Checkbox, TextInput as PaperTextInput, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const FocusScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutes default
  const [selectedTime, setSelectedTime] = useState(25); // minutes
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 28, condition: 'Partly Cloudy', city: 'Mumbai' });
  const [todos, setTodos] = useState([
    { id: 1, text: 'Take a 10-minute walk', completed: false },
    { id: 2, text: 'Call a friend for support', completed: false },
    { id: 3, text: 'Practice deep breathing', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');


  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, date: '2024-01-15', title: 'Support Group Meeting', type: 'meeting' },
    { id: 2, date: '2024-01-20', title: 'Exercise Session', type: 'exercise' },
    { id: 3, date: '2024-01-25', title: 'Meditation Practice', type: 'meditation' },
  ]);

  const timeOptions = [15, 25, 30, 45, 60]; // minutes

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            Alert.alert('Pomodoro Complete!', 'Great job! Take a 5-minute break.');
            return selectedTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, selectedTime]);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded) return null;

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };



  const setTimerTime = (minutes: number) => {
    setSelectedTime(minutes);
    setTimerSeconds(minutes * 60);
    setTimerRunning(false);
  };

  const startTimer = () => {
    if (!timerRunning) {
      setTimerSeconds(selectedTime * 60);
    }
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(selectedTime * 60);
  };

  const focusFeatures = [
    { 
      title: 'Pomodoro Timer', 
      icon: 'timer', 
      action: () => setTimerRunning(!timerRunning), 
      color: '#4C9F70', 
      backgroundColor: '#E8F5E8',
      description: 'Stay focused with customizable work sessions'
    },
    { 
      title: 'Notes & Todo', 
      icon: 'note-text', 
      action: () => navigation.navigate('MyJournal'), 
      color: '#607D8B', 
      backgroundColor: '#ECEFF1',
      description: 'Write notes and manage your todo list'
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const Content = () => (
    <>
      <View style={styles.header}>
        <MaterialCommunityIcons name="target" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Focus & Productivity</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          Tools to help you stay focused and productive in your recovery journey.
        </Paragraph>
      </View>

      {/* Timer Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Pomodoro Timer</Title>
          
          {/* Time Selection */}
          <View style={styles.timeSelection}>
            <Paragraph style={[styles.timeLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
              Select Duration:
            </Paragraph>
            <View style={styles.timeOptions}>
              {timeOptions.map(minutes => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.timeOption,
                    { 
                      backgroundColor: selectedTime === minutes ? theme.colors.primary : '#E0E0E0',
                      borderColor: selectedTime === minutes ? theme.colors.primary : '#E0E0E0'
                    }
                  ]}
                  onPress={() => setTimerTime(minutes)}
                >
                  <Paragraph style={[
                    styles.timeOptionText,
                    { 
                      fontFamily: 'Inter_700Bold',
                      color: selectedTime === minutes ? '#fff' : theme.colors.text
                    }
                  ]}>
                    {minutes}m
                  </Paragraph>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.timerContainer, { backgroundColor: '#E8F5E8' }]}>
            <Title style={[styles.timerText, { fontFamily: 'Inter_700Bold', color: '#4CAF50' }]}>
              {formatTime(timerSeconds)}
            </Title>
            <View style={styles.timerControls}>
              <Button 
                mode="contained" 
                onPress={startTimer}
                style={[styles.timerButton, { backgroundColor: timerRunning ? '#F44336' : '#4CAF50' }]}
                labelStyle={{ fontFamily: 'Inter_700Bold' }}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </Button>
              <Button 
                mode="outlined" 
                onPress={resetTimer}
                style={styles.timerButton}
                labelStyle={{ fontFamily: 'Inter_400Regular' }}
              >
                Reset
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>





      {/* Focus Features Grid */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Focus Tools</Title>
          <View style={styles.featuresGrid}>
            {focusFeatures.map((feature, index) => (
              <TouchableOpacity
                key={feature.title}
                style={[styles.featureItem, { backgroundColor: feature.backgroundColor }]}
                onPress={feature.action}
                activeOpacity={0.7}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <MaterialCommunityIcons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <Title style={[styles.featureTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {feature.title}
                </Title>
                <Paragraph style={[styles.featureDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {feature.description}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Daily Focus Tip */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Today's Focus Tip</Title>
          <View style={[styles.tipContainer, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#2196F3" />
            <Paragraph style={[styles.tipText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
              "Break your day into focused 25-minute sessions. Take 5-minute breaks between sessions to maintain productivity and reduce stress."
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Bottom Spacer to ensure scrolling */}
      <View style={{ height: 100 }} />
    </>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}> 
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={{ ...styles.container, paddingBottom: 180, flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        keyboardShouldPersistTaps="always"
      >
        {/* Header, Pomodoro Timer, Focus Tools, Daily Focus Tip go here */}
        <Content />
      </ScrollView>
      {/* Place any FAB or floating buttons here if needed */}
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
    paddingBottom: 100,
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
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 42,
    marginBottom: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    borderRadius: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  todoInput: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  todoText: {
    flex: 1,
    marginLeft: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  checklistText: {
    flex: 1,
    marginLeft: 10,
  },
  goalItem: {
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    flex: 1,
    marginRight: 10,
  },
  progressChip: {
    backgroundColor: '#E0F2F7',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalProgress: {
    fontSize: 12,
  },
  timeSelection: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 14,
  },
  calendarContainer: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventText: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addEventText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default FocusScreen; 