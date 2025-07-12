import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme, Chip, TextInput, FAB, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

interface Trigger {
  id: string;
  name: string;
  category: string;
  frequency: number;
  lastOccurrence: Date;
  notes: string;
}

const TriggerIdentificationScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  
  const [triggers, setTriggers] = useState<Trigger[]>([
    {
      id: '1',
      name: 'Late Night Boredom',
      category: 'Time',
      frequency: 5,
      lastOccurrence: new Date('2024-01-15'),
      notes: 'Usually happens between 10 PM - 2 AM'
    },
    {
      id: '2',
      name: 'Financial Stress',
      category: 'Emotional',
      frequency: 3,
      lastOccurrence: new Date('2024-01-12'),
      notes: 'When bills are due or money is tight'
    },
    {
      id: '3',
      name: 'Social Media Ads',
      category: 'Environmental',
      frequency: 8,
      lastOccurrence: new Date('2024-01-18'),
      notes: 'Gambling ads on Instagram and Facebook'
    }
  ]);

  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    category: '',
    notes: ''
  });

  const triggerCategories = [
    { name: 'Time', color: '#4CAF50', icon: 'clock' },
    { name: 'Emotional', color: '#F44336', icon: 'heart' },
    { name: 'Environmental', color: '#2196F3', icon: 'earth' },
    { name: 'Social', color: '#FF9800', icon: 'account-group' },
    { name: 'Physical', color: '#9C27B0', icon: 'body' },
    { name: 'Other', color: '#607D8B', icon: 'dots-horizontal' }
  ];

  if (!fontsLoaded) return null;

  const addTrigger = () => {
    if (newTrigger.name.trim() && newTrigger.category.trim()) {
      const trigger: Trigger = {
        id: Date.now().toString(),
        name: newTrigger.name,
        category: newTrigger.category,
        frequency: 1,
        lastOccurrence: new Date(),
        notes: newTrigger.notes
      };
      setTriggers([trigger, ...triggers]);
      setNewTrigger({ name: '', category: '', notes: '' });
      setShowAddTrigger(false);
      Alert.alert('Trigger Added', 'New trigger has been added to your tracking list.');
    } else {
      Alert.alert('Missing Information', 'Please fill in the trigger name and category.');
    }
  };

  const recordTriggerOccurrence = (triggerId: string) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === triggerId 
        ? { ...trigger, frequency: trigger.frequency + 1, lastOccurrence: new Date() }
        : trigger
    ));
    Alert.alert('Trigger Recorded', 'This occurrence has been recorded. Stay strong!');
  };

  const getCategoryColor = (category: string) => {
    const cat = triggerCategories.find(c => c.name === category);
    return cat ? cat.color : '#607D8B';
  };

  const getCategoryIcon = (category: string) => {
    const cat = triggerCategories.find(c => c.name === category);
    return cat ? cat.icon : 'dots-horizontal';
  };

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={[styles.container, { paddingBottom: 150, flexGrow: 1 }]}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="target" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Trigger Identification</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          Identify and track your gambling triggers to better understand your patterns.
        </Paragraph>
      </View>

      {/* Trigger Summary */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Your Triggers</Title>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="alert" size={24} color={theme.colors.primary} />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                {triggers.length}
              </Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Triggers Identified
              </Paragraph>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="trending-up" size={24} color={theme.colors.primary} />
              <Title style={[styles.statNumber, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                {triggers.reduce((sum, t) => sum + t.frequency, 0)}
              </Title>
              <Paragraph style={[styles.statLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Total Occurrences
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Trigger List */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Your Triggers</Title>
          {triggers.map((trigger) => (
            <View key={trigger.id} style={styles.triggerItem}>
              <View style={styles.triggerHeader}>
                <View style={styles.triggerLeft}>
                  <View style={[styles.triggerIcon, { backgroundColor: getCategoryColor(trigger.category) + '20' }]}>
                    <MaterialCommunityIcons 
                      name={getCategoryIcon(trigger.category) as any} 
                      size={20} 
                      color={getCategoryColor(trigger.category)} 
                    />
                  </View>
                  <View style={styles.triggerInfo}>
                    <Title style={[styles.triggerName, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                      {trigger.name}
                    </Title>
                    <Chip 
                      mode="outlined" 
                      style={[styles.categoryChip, { borderColor: getCategoryColor(trigger.category) }]}
                    >
                      {trigger.category}
                    </Chip>
                  </View>
                </View>
                <View style={styles.triggerStats}>
                  <Paragraph style={[styles.frequencyText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    {trigger.frequency} times
                  </Paragraph>
                  <Paragraph style={[styles.dateText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    {trigger.lastOccurrence.toLocaleDateString()}
                  </Paragraph>
                </View>
              </View>
              
              {trigger.notes && (
                <Paragraph style={[styles.triggerNotes, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {trigger.notes}
                </Paragraph>
              )}
              
              <View style={styles.triggerActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => recordTriggerOccurrence(trigger.id)}
                  style={[styles.actionButton, { borderColor: getCategoryColor(trigger.category) }]}
                  textColor={getCategoryColor(trigger.category)}
                  labelStyle={{ fontFamily: 'Inter_400Regular' }}
                >
                  Record Occurrence
                </Button>
              </View>
            </View>
          ))}
          
          {triggers.length === 0 && (
            <Paragraph style={[styles.emptyText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
              No triggers identified yet. Add your first trigger to start tracking!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Pattern Insights */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Pattern Insights</Title>
          <View style={styles.insightsContainer}>
            <View style={styles.insightItem}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
              <Paragraph style={[styles.insightText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Most triggers occur in the evening (8 PM - 12 AM)
              </Paragraph>
            </View>
            <View style={styles.insightItem}>
              <MaterialCommunityIcons name="emoticon-sad" size={24} color={theme.colors.primary} />
              <Paragraph style={[styles.insightText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Emotional triggers are most common
              </Paragraph>
            </View>
            <View style={styles.insightItem}>
              <MaterialCommunityIcons name="trending-down" size={24} color={theme.colors.primary} />
              <Paragraph style={[styles.insightText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                Trigger frequency has decreased by 30% this week
              </Paragraph>
            </View>
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
      
      {/* Add Trigger FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAddTrigger(true)}
      />

      {/* Add Trigger Dialog */}
      <Portal>
        <Dialog visible={showAddTrigger} onDismiss={() => setShowAddTrigger(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Add New Trigger</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Trigger Name"
              value={newTrigger.name}
              onChangeText={(text) => setNewTrigger({ ...newTrigger, name: text })}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Category"
              value={newTrigger.category}
              onChangeText={(text) => setNewTrigger({ ...newTrigger, category: text })}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Notes (optional)"
              value={newTrigger.notes}
              onChangeText={(text) => setNewTrigger({ ...newTrigger, notes: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddTrigger(false)}>Cancel</Button>
            <Button onPress={addTrigger}>Add Trigger</Button>
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
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  triggerItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  triggerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  triggerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  triggerInfo: {
    flex: 1,
  },
  triggerName: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  triggerStats: {
    alignItems: 'flex-end',
  },
  frequencyText: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 10,
  },
  triggerNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  triggerActions: {
    marginTop: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  insightsContainer: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TriggerIdentificationScreen; 