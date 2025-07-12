import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme, TextInput, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const UrgeSurfingScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  
  // Urge surfing state
  const [showUrgeDialog, setShowUrgeDialog] = useState(false);
  const [urgeIntensity, setUrgeIntensity] = useState(5);
  const [urgeTrigger, setUrgeTrigger] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingOpacity] = useState(new Animated.Value(1));

  // Breathing animation
  useEffect(() => {
    const breathingCycle = () => {
      Animated.sequence([
        Animated.timing(breathingOpacity, {
          toValue: 0.3,
          duration: 4000, // 4 seconds inhale
          useNativeDriver: true,
        }),
        Animated.timing(breathingOpacity, {
          toValue: 1,
          duration: 4000, // 4 seconds exhale
          useNativeDriver: true,
        }),
      ]).start(() => breathingCycle());
    };
    
    if (showUrgeDialog) {
      breathingCycle();
    }
  }, [showUrgeDialog, breathingOpacity]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            Alert.alert('Time Up!', 'Great job waiting! The urge should be weaker now. You can do this!');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (!fontsLoaded) return null;

  const startUrgeSurfing = () => {
    setShowUrgeDialog(true);
    setTimerSeconds(300);
    setTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUrgeComplete = () => {
    if (urgeTrigger.trim()) {
      setShowUrgeDialog(false);
      setUrgeTrigger('');
      setTimerRunning(false);
      Alert.alert('Urge Surfed!', 'You successfully rode the wave of your urge. This feeling will pass, and you\'re getting stronger!');
    } else {
      Alert.alert('Please Add Trigger', 'Please identify what triggered this urge to help with future prevention.');
    }
  };

  const copingStrategies = [
    {
      title: 'Deep Breathing',
      description: 'Focus on your breath. Inhale for 4, hold for 4, exhale for 4.',
      icon: 'lungs',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8'
    },
    {
      title: 'Call a Friend',
      description: 'Reach out to someone you trust for support.',
      icon: 'phone',
      color: '#2196F3',
      backgroundColor: '#E3F2FD'
    },
    {
      title: 'Take a Walk',
      description: 'Physical activity can help reduce urges.',
      icon: 'walk',
      color: '#FF9800',
      backgroundColor: '#FFF3E0'
    },
    {
      title: 'Meditation',
      description: 'Practice mindfulness to stay present.',
      icon: 'meditation',
      color: '#9C27B0',
      backgroundColor: '#F3E5F5'
    },
    {
      title: 'Journal',
      description: 'Write down your thoughts and feelings.',
      icon: 'notebook',
      color: '#607D8B',
      backgroundColor: '#ECEFF1'
    },
    {
      title: 'Cold Shower',
      description: 'A cold shower can help reset your nervous system.',
      icon: 'shower',
      color: '#00BCD4',
      backgroundColor: '#E0F7FA'
    }
  ];

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={[styles.container, { paddingBottom: 150, flexGrow: 1 }]}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="waves" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Urge Surfing</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          When urges hit, ride the wave instead of fighting it. This feeling will pass.
        </Paragraph>
      </View>

      {/* Emergency Urge Button */}
      <Card style={[styles.emergencyCard, { backgroundColor: '#FFEBEE' }]}>
        <Card.Content>
          <View style={styles.emergencyHeader}>
            <MaterialCommunityIcons name="alert-circle" size={32} color="#F44336" />
            <View style={styles.emergencyText}>
              <Title style={[styles.emergencyTitle, { fontFamily: 'Inter_700Bold', color: '#F44336' }]}>
                Strong Urge Right Now?
              </Title>
              <Paragraph style={[styles.emergencyDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Click below to start urge surfing immediately
              </Paragraph>
            </View>
          </View>
          <Button 
            mode="contained" 
            onPress={startUrgeSurfing}
            style={[styles.emergencyButton, { backgroundColor: '#F44336' }]}
            labelStyle={{ fontFamily: 'Inter_700Bold' }}
          >
            🚨 Start Urge Surfing Now
          </Button>
        </Card.Content>
      </Card>

      {/* Coping Strategies */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Coping Strategies</Title>
          <View style={styles.strategiesGrid}>
            {copingStrategies.map((strategy, index) => (
              <TouchableOpacity
                key={strategy.title}
                style={[styles.strategyItem, { backgroundColor: strategy.backgroundColor }]}
                onPress={() => Alert.alert(strategy.title, strategy.description)}
                activeOpacity={0.7}
              >
                <View style={[styles.strategyIcon, { backgroundColor: strategy.color + '20' }]}>
                  <MaterialCommunityIcons name={strategy.icon as any} size={24} color={strategy.color} />
                </View>
                <Title style={[styles.strategyTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {strategy.title}
                </Title>
                <Paragraph style={[styles.strategyDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {strategy.description}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Educational Content */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Understanding Urge Surfing</Title>
          <Paragraph style={[styles.educationText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
            Urge surfing is a mindfulness technique that helps you ride out cravings without acting on them. 
            Instead of fighting the urge, you observe it like a wave - it builds, peaks, and then subsides.
          </Paragraph>
          <Paragraph style={[styles.educationText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
            Remember: urges typically last only 15-30 minutes. If you can wait them out, they will pass.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Bottom Spacer */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}>
      <Content />
      
      {/* Urge Surfing Dialog */}
      <Portal>
        <Dialog visible={showUrgeDialog} onDismiss={() => setShowUrgeDialog(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Urge Surfing Session</Dialog.Title>
          <Dialog.Content>
            <View style={styles.urgeContent}>
              {/* Breathing Animation */}
              <Animated.View style={[styles.breathingCircle, { opacity: breathingOpacity }]}>
                <MaterialCommunityIcons name="lungs" size={48} color={theme.colors.primary} />
              </Animated.View>
              
              <Paragraph style={[styles.breathingText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Focus on your breath. Breathe deeply and slowly.
              </Paragraph>

              {/* Timer */}
              <View style={styles.timerContainer}>
                <Title style={[styles.timerText, { fontFamily: 'Inter_700Bold', color: theme.colors.primary }]}>
                  {formatTime(timerSeconds)}
                </Title>
                <Paragraph style={[styles.timerLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Wait 5 minutes before acting
                </Paragraph>
              </View>

              {/* Trigger Identification */}
              <TextInput
                label="What triggered this urge?"
                value={urgeTrigger}
                onChangeText={setUrgeTrigger}
                mode="outlined"
                style={{ marginTop: 16 }}
                multiline
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowUrgeDialog(false)}>Cancel</Button>
            <Button onPress={handleUrgeComplete}>Complete Session</Button>
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
  emergencyCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyText: {
    marginLeft: 16,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  emergencyDesc: {
    fontSize: 14,
  },
  emergencyButton: {
    borderRadius: 12,
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
  strategiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  strategyItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  strategyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  strategyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  strategyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  educationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  urgeContent: {
    alignItems: 'center',
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  breathingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 36,
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
  },
});

export default UrgeSurfingScreen; 