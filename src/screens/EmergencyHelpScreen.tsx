import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const EmergencyHelpScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  
  const emergencyContacts = [
    {
      name: 'National Gambling Helpline',
      number: '1-800-522-4700',
      description: '24/7 confidential support',
      icon: 'phone',
      color: '#F44336'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis support',
      icon: 'message-text',
      color: '#2196F3'
    },
    {
      name: 'Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 suicide prevention',
      icon: 'heart',
      color: '#E91E63'
    }
  ];

  const copingTechniques = [
    {
      title: 'Deep Breathing',
      description: 'Breathe in for 4, hold for 4, exhale for 4',
      icon: 'lungs',
      color: '#4CAF50',
      action: () => navigation.navigate('UrgeSurfing')
    },
    {
      title: 'Call a Friend',
      description: 'Reach out to someone you trust',
      icon: 'phone',
      color: '#2196F3',
      action: () => Alert.alert('Call Friend', 'Call someone you trust for support right now.')
    },
    {
      title: 'Take a Walk',
      description: 'Get outside and move your body',
      icon: 'walk',
      color: '#FF9800',
      action: () => Alert.alert('Take a Walk', 'Go for a 10-minute walk to clear your mind.')
    },
    {
      title: 'Cold Shower',
      description: 'Reset your nervous system',
      icon: 'shower',
      color: '#00BCD4',
      action: () => Alert.alert('Cold Shower', 'Take a cold shower to reset your nervous system.')
    },
    {
      title: 'Write It Down',
      description: 'Journal your thoughts and feelings',
      icon: 'notebook',
      color: '#607D8B',
      action: () => navigation.navigate('MyJournal')
    },
    {
      title: 'Meditation',
      description: 'Practice mindfulness for 5 minutes',
      icon: 'meditation',
      color: '#9C27B0',
      action: () => Alert.alert('Meditation', 'Find a quiet place and meditate for 5 minutes.')
    }
  ];

  const encouragingMessages = [
    "You are stronger than this urge. It will pass.",
    "Every moment you resist makes you stronger.",
    "You don't have to act on this feeling.",
    "This is temporary. You can get through this.",
    "You are not alone. Help is available.",
    "Your future self will thank you for staying strong."
  ];

  if (!fontsLoaded) return null;

  const callEmergency = (contact: any) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            if (contact.number.includes('Text')) {
              Alert.alert('Text Line', 'Text HOME to 741741 for crisis support');
            } else {
              Linking.openURL(`tel:${contact.number}`);
            }
          }
        }
      ]
    );
  };

  const showRandomMessage = () => {
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    Alert.alert('Remember', randomMessage);
  };

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={[styles.container, { paddingBottom: 150, flexGrow: 1 }]}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="phone-alert" size={48} color="#F44336" />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Emergency Help</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          You're not alone. Help is available 24/7. Stay strong.
        </Paragraph>
      </View>

      {/* Emergency Contacts */}
      <Card style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: '#F44336' }]}>Emergency Contacts</Title>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={contact.name}
              style={styles.contactItem}
              onPress={() => callEmergency(contact)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
                <MaterialCommunityIcons name={contact.icon as any} size={24} color={contact.color} />
              </View>
              <View style={styles.contactInfo}>
                <Title style={[styles.contactName, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {contact.name}
                </Title>
                <Paragraph style={[styles.contactNumber, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {contact.number}
                </Paragraph>
                <Paragraph style={[styles.contactDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {contact.description}
                </Paragraph>
              </View>
              <MaterialCommunityIcons name="phone" size={24} color={contact.color} />
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Coping Techniques */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Quick Coping Techniques</Title>
          <View style={styles.techniquesGrid}>
            {copingTechniques.map((technique, index) => (
              <TouchableOpacity
                key={technique.title}
                style={[styles.techniqueItem, { backgroundColor: technique.color + '20' }]}
                onPress={technique.action}
                activeOpacity={0.7}
              >
                <View style={[styles.techniqueIcon, { backgroundColor: technique.color + '40' }]}>
                  <MaterialCommunityIcons name={technique.icon as any} size={24} color={technique.color} />
                </View>
                <Title style={[styles.techniqueTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {technique.title}
                </Title>
                <Paragraph style={[styles.techniqueDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {technique.description}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Encouragement */}
      <Card style={[styles.card, { backgroundColor: '#E8F5E8' }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: '#4CAF50' }]}>You Can Do This</Title>
          <View style={styles.encouragementContent}>
            <MaterialCommunityIcons name="heart" size={32} color="#4CAF50" />
            <Paragraph style={[styles.encouragementText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>
              "Every moment you choose not to gamble is a moment you choose yourself. You are stronger than your urges."
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={showRandomMessage}
              style={[styles.encouragementButton, { backgroundColor: '#4CAF50' }]}
              labelStyle={{ fontFamily: 'Inter_700Bold' }}
            >
              💪 Get Encouragement
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Immediate Actions */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Immediate Actions</Title>
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('UrgeSurfing')}
              style={[styles.actionButton, { backgroundColor: '#F44336' }]}
              labelStyle={{ fontFamily: 'Inter_700Bold' }}
            >
              🚨 Start Urge Surfing
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('MyJournal')}
              style={[styles.actionButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
              labelStyle={{ fontFamily: 'Inter_400Regular' }}
            >
              📝 Write It Down
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('TriggerIdentification')}
              style={[styles.actionButton, { borderColor: '#9C27B0' }]}
              textColor="#9C27B0"
              labelStyle={{ fontFamily: 'Inter_400Regular' }}
            >
              🎯 Identify Trigger
            </Button>
          </View>
        </Card.Content>
      </Card>

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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactDesc: {
    fontSize: 12,
  },
  techniquesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techniqueItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  techniqueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  techniqueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  techniqueDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  encouragementContent: {
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 16,
  },
  encouragementButton: {
    borderRadius: 12,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
});

export default EmergencyHelpScreen; 