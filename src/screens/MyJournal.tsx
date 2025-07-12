import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme as useAppTheme } from '../context/ThemeContext';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'good' | 'okay' | 'bad';
  type: 'note' | 'todo';
  completed?: boolean;
}

const MyJournal = () => {
  const theme = useTheme();
  const { theme: appTheme } = useAppTheme();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      content: 'Today I felt strong and resisted the urge to gamble. I went for a walk instead.',
      mood: 'good',
      type: 'note',
    },
    {
      id: '2',
      date: '2024-01-15',
      content: 'Call my support group',
      mood: 'okay',
      type: 'todo',
      completed: false,
    },
    {
      id: '3',
      date: '2024-01-14',
      content: 'Read motivational book for 30 minutes',
      mood: 'good',
      type: 'todo',
      completed: true,
    },
  ]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', mood: 'okay' as 'good' | 'okay' | 'bad', type: 'note' as 'note' | 'todo' });

  if (!fontsLoaded) return null;

  const addEntry = () => {
    if (newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        content: newEntry.content,
        mood: newEntry.mood,
        type: newEntry.type,
        completed: false,
      };
      setEntries([entry, ...entries]);
      setNewEntry({ content: '', mood: 'okay', type: 'note' });
      setShowAddEntry(false);
    }
  };

  const toggleTodo = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, completed: !entry.completed } : entry
    ));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'good': return 'emoticon-happy';
      case 'okay': return 'emoticon-neutral';
      case 'bad': return 'emoticon-sad';
      default: return 'emoticon-neutral';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'good': return '#4caf50';
      case 'okay': return '#ff9800';
      case 'bad': return '#f44336';
      default: return '#ff9800';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appTheme.colors.background }]}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header Card */}
        <Card style={[styles.headerCard, { backgroundColor: appTheme.colors.card }]}>
          <Card.Content style={styles.headerContent}>
            <MaterialCommunityIcons name="notebook" size={32} color={appTheme.colors.primary} />
            <View style={styles.headerText}>
              <Title style={[styles.headerTitle, { fontFamily: 'Inter_700Bold', color: appTheme.colors.text }]}>My Journal</Title>
              <Paragraph style={[styles.headerSubtitle, { fontFamily: 'Inter_400Regular', color: appTheme.colors.textSecondary }]}>
                Track your thoughts, feelings, and progress
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Add Entry Card */}
        {showAddEntry && (
          <Card style={[styles.addEntryCard, { backgroundColor: appTheme.colors.card }]}>
            <Card.Content>
              <Title style={[styles.addEntryTitle, { fontFamily: 'Inter_700Bold', color: appTheme.colors.text }]}>Add New Entry</Title>
              
              {/* Type Selector */}
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    { 
                      backgroundColor: newEntry.type === 'note' ? appTheme.colors.primary : '#E0E0E0',
                      borderColor: appTheme.colors.primary,
                      borderWidth: 1
                    }
                  ]}
                  onPress={() => setNewEntry({ ...newEntry, type: 'note' })}
                >
                  <MaterialCommunityIcons 
                    name="notebook" 
                    size={20} 
                    color={newEntry.type === 'note' ? '#fff' : appTheme.colors.primary} 
                  />
                  <Paragraph style={[
                    styles.typeButtonText,
                    { 
                      fontFamily: 'Inter_400Regular',
                      color: newEntry.type === 'note' ? '#fff' : appTheme.colors.primary 
                    }
                  ]}>
                    Note
                  </Paragraph>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    { 
                      backgroundColor: newEntry.type === 'todo' ? appTheme.colors.primary : '#E0E0E0',
                      borderColor: appTheme.colors.primary,
                      borderWidth: 1
                    }
                  ]}
                  onPress={() => setNewEntry({ ...newEntry, type: 'todo' })}
                >
                  <MaterialCommunityIcons 
                    name="checkbox-marked-outline" 
                    size={20} 
                    color={newEntry.type === 'todo' ? '#fff' : appTheme.colors.primary} 
                  />
                  <Paragraph style={[
                    styles.typeButtonText,
                    { 
                      fontFamily: 'Inter_400Regular',
                      color: newEntry.type === 'todo' ? '#fff' : appTheme.colors.primary 
                    }
                  ]}>
                    Todo
                  </Paragraph>
                </TouchableOpacity>
              </View>

              {/* Content Input */}
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    borderColor: appTheme.colors.border,
                    color: appTheme.colors.text,
                    backgroundColor: appTheme.colors.surface
                  }
                ]}
                placeholder="Write your thoughts or add a todo item..."
                placeholderTextColor={appTheme.colors.textSecondary}
                value={newEntry.content}
                onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
                multiline
              />

              {/* Mood Selector */}
              <View style={styles.moodSelector}>
                <Paragraph style={[styles.moodLabel, { fontFamily: 'Inter_400Regular', color: appTheme.colors.text }]}>
                  How are you feeling?
                </Paragraph>
                <View style={styles.moodButtons}>
                  {['good', 'okay', 'bad'].map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodButton,
                        { 
                          backgroundColor: newEntry.mood === mood ? getMoodColor(mood) : '#E0E0E0'
                        }
                      ]}
                      onPress={() => setNewEntry({ ...newEntry, mood: mood as 'good' | 'okay' | 'bad' })}
                    >
                      <MaterialCommunityIcons 
                        name={getMoodIcon(mood)} 
                        size={24} 
                        color={newEntry.mood === mood ? '#fff' : getMoodColor(mood)} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.addEntryActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowAddEntry(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={addEntry}
                  style={[styles.saveButton, { backgroundColor: appTheme.colors.primary }]}
                >
                  Save
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Journal Entries */}
        {entries.map((entry) => (
          <Card key={entry.id} style={[styles.entryCard, { backgroundColor: appTheme.colors.card }]}>
            <Card.Content>
              <View style={styles.entryHeader}>
                <View style={styles.entryMeta}>
                  <MaterialCommunityIcons 
                    name={entry.type === 'note' ? 'notebook' : 'checkbox-marked-outline'} 
                    size={20} 
                    color={appTheme.colors.primary} 
                  />
                  <Paragraph style={[styles.entryDate, { fontFamily: 'Inter_400Regular', color: appTheme.colors.textSecondary }]}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Paragraph>
                </View>
                <MaterialCommunityIcons 
                  name={getMoodIcon(entry.mood)} 
                  size={24} 
                  color={getMoodColor(entry.mood)} 
                />
              </View>
              
              <TouchableOpacity
                onPress={() => entry.type === 'todo' && toggleTodo(entry.id)}
                disabled={entry.type !== 'todo'}
                style={styles.entryContent}
              >
                <Paragraph style={[
                  styles.entryText, 
                  { fontFamily: 'Inter_400Regular', color: appTheme.colors.text },
                  entry.type === 'todo' && entry.completed && styles.completedText
                ]}>
                  {entry.content}
                </Paragraph>
              </TouchableOpacity>

              {entry.type === 'todo' && (
                <Chip 
                  icon={entry.completed ? 'check-circle' : 'circle-outline'} 
                  mode="outlined"
                  style={styles.todoChip}
                >
                  {entry.completed ? 'Completed' : 'Pending'}
                </Chip>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: appTheme.colors.primary }]}
        onPress={() => setShowAddEntry(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  addEntryCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  addEntryTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  typeButtonText: {
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  moodSelector: {
    marginBottom: 16,
  },
  moodLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    padding: 12,
    borderRadius: 24,
  },
  addEntryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  entryCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  entryCardBackground: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completedTodo: {
    opacity: 0.6,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryDate: {
    marginLeft: 8,
    fontSize: 12,
  },
  entryContent: {
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  todoChip: {
    alignSelf: 'flex-start',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MyJournal; 