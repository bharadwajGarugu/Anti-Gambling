import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, TextInput } from 'react-native';
import { Card, Title, Paragraph, useTheme as usePaperTheme, Button, Chip, TextInput as PaperTextInput, FAB, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';
import AppUsageService, { InstalledApp, AppUsageEntry, AppAvoidance } from '../services/AppUsageService';

const AppUsageScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [usageEntries, setUsageEntries] = useState<AppUsageEntry[]>([]);
  const [avoidanceList, setAvoidanceList] = useState<AppAvoidance[]>([]);
  const [usageInsights, setUsageInsights] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null);
  const [showAddUsageDialog, setShowAddUsageDialog] = useState(false);
  const [showAddAvoidanceDialog, setShowAddAvoidanceDialog] = useState(false);
  const [usageDuration, setUsageDuration] = useState('');
  const [usageNotes, setUsageNotes] = useState('');
  const [avoidanceReason, setAvoidanceReason] = useState('');
  const [avoidanceReminder, setAvoidanceReminder] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apps, entries, avoidance, insights] = await Promise.all([
        AppUsageService.getInstalledApps(),
        AppUsageService.getUsageEntries(),
        AppUsageService.getAvoidanceList(),
        AppUsageService.getUsageInsights(7)
      ]);
      
      setInstalledApps(apps);
      setUsageEntries(entries);
      setAvoidanceList(avoidance);
      setUsageInsights(insights);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (!fontsLoaded) return null;

  const addUsageEntry = async () => {
    if (!selectedApp || !usageDuration) {
      Alert.alert('Error', 'Please select an app and enter duration');
      return;
    }

    try {
      const duration = parseInt(usageDuration);
      if (isNaN(duration) || duration <= 0) {
        Alert.alert('Error', 'Please enter a valid duration');
        return;
      }

      await AppUsageService.addUsageEntry(
        selectedApp.id,
        selectedApp.name,
        duration,
        usageNotes,
        'neutral'
      );

      setShowAddUsageDialog(false);
      setSelectedApp(null);
      setUsageDuration('');
      setUsageNotes('');
      loadData();
      Alert.alert('Success', 'Usage entry added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add usage entry');
    }
  };

  const addToAvoidanceList = async () => {
    if (!selectedApp || !avoidanceReason) {
      Alert.alert('Error', 'Please select an app and enter a reason');
      return;
    }

    try {
      await AppUsageService.addToAvoidanceList(
        selectedApp.id,
        selectedApp.name,
        avoidanceReason,
        avoidanceReminder
      );

      setShowAddAvoidanceDialog(false);
      setSelectedApp(null);
      setAvoidanceReason('');
      setAvoidanceReminder('');
      loadData();
      Alert.alert('Success', 'App added to avoidance list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to avoidance list');
    }
  };

  const removeFromAvoidanceList = async (appId: string) => {
    try {
      await AppUsageService.removeFromAvoidanceList(appId);
      loadData();
      Alert.alert('Success', 'App removed from avoidance list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from avoidance list');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const Content = () => (
    <ScrollView 
      style={[styles.scroll, { backgroundColor: 'transparent' }]} 
      contentContainerStyle={[styles.container, { paddingBottom: 200 }]}
      showsVerticalScrollIndicator={true}
      bounces={true}
      overScrollMode="always"
      nestedScrollEnabled={false}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="cellphone" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>App Usage Tracker</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
          Track your app usage and manage apps you want to avoid.
        </Paragraph>
      </View>

      {/* Usage Insights */}
      {usageInsights && (
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>This Week's Insights</Title>
            <View style={styles.insightsGrid}>
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
                <Title style={[styles.insightValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {formatDuration(usageInsights.totalTime)}
                </Title>
                <Paragraph style={[styles.insightLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Total Time
                </Paragraph>
              </View>
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
                <Title style={[styles.insightValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {formatDuration(Math.round(usageInsights.averageTimePerDay))}
                </Title>
                <Paragraph style={[styles.insightLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Daily Average
                </Paragraph>
              </View>
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="apps" size={24} color={theme.colors.primary} />
                <Title style={[styles.insightValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {usageInsights.appsUsed}
                </Title>
                <Paragraph style={[styles.insightLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  Apps Used
                </Paragraph>
              </View>
              {usageInsights.mostUsedApp && (
                <View style={styles.insightItem}>
                  <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
                  <Title style={[styles.insightValue, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                    {usageInsights.mostUsedApp.appName}
                  </Title>
                  <Paragraph style={[styles.insightLabel, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    Most Used
                  </Paragraph>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Installed Apps */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Installed Apps</Title>
          <View style={styles.appsGrid}>
            {installedApps.map(app => (
              <TouchableOpacity
                key={app.id}
                style={[styles.appItem, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
                onPress={() => {
                  setSelectedApp(app);
                  setShowAddUsageDialog(true);
                }}
              >
                <MaterialCommunityIcons 
                  name="cellphone" 
                  size={32} 
                  color={theme.colors.primary} 
                />
                <Title style={[styles.appName, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {app.name}
                </Title>
                <Paragraph style={[styles.appPackage, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {app.packageName}
                </Paragraph>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Recent Usage */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Recent Usage</Title>
          {usageEntries.slice(0, 5).map(entry => (
            <View key={entry.id} style={styles.usageItem}>
              <View style={styles.usageLeft}>
                <MaterialCommunityIcons name="cellphone" size={20} color={theme.colors.primary} />
                <View style={styles.usageText}>
                  <Title style={[styles.usageAppName, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                    {entry.appName}
                  </Title>
                  <Paragraph style={[styles.usageTime, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    {formatDuration(entry.duration)} • {new Date(entry.date).toLocaleDateString()}
                  </Paragraph>
                </View>
              </View>
              {entry.notes && (
                <Paragraph style={[styles.usageNotes, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {entry.notes}
                </Paragraph>
              )}
            </View>
          ))}
          {usageEntries.length === 0 && (
            <Paragraph style={[styles.emptyText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
              No usage entries yet. Start tracking your app usage!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Avoidance List */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Apps to Avoid</Title>
          {avoidanceList.map(item => (
            <View key={item.id} style={styles.avoidanceItem}>
              <View style={styles.avoidanceLeft}>
                <MaterialCommunityIcons name="block-helper" size={20} color="#F44336" />
                <View style={styles.avoidanceText}>
                  <Title style={[styles.avoidanceAppName, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                    {item.appName}
                  </Title>
                  <Paragraph style={[styles.avoidanceReason, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                    {item.reason}
                  </Paragraph>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeFromAvoidanceList(item.appId)}
                style={styles.removeButton}
              >
                <MaterialCommunityIcons name="close" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
          {avoidanceList.length === 0 && (
            <Paragraph style={[styles.emptyText, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
              No apps in avoidance list. Add apps you want to avoid!
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Bottom Spacer */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.background }]}>
      <Content />
      
      {/* Add Usage FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAddUsageDialog(true)}
      />

      {/* Add Usage Dialog */}
      <Portal>
        <Dialog visible={showAddUsageDialog} onDismiss={() => setShowAddUsageDialog(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Add Usage Entry</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="App"
              value={selectedApp?.name || ''}
              disabled
              style={styles.dialogInput}
            />
            <PaperTextInput
              label="Duration (minutes)"
              value={usageDuration}
              onChangeText={setUsageDuration}
              keyboardType="numeric"
              style={styles.dialogInput}
            />
            <PaperTextInput
              label="Notes (optional)"
              value={usageNotes}
              onChangeText={setUsageNotes}
              multiline
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddUsageDialog(false)}>Cancel</Button>
            <Button onPress={addUsageEntry}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Avoidance Dialog */}
      <Portal>
        <Dialog visible={showAddAvoidanceDialog} onDismiss={() => setShowAddAvoidanceDialog(false)}>
          <Dialog.Title style={{ fontFamily: 'Inter_700Bold' }}>Add to Avoidance List</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="App"
              value={selectedApp?.name || ''}
              disabled
              style={styles.dialogInput}
            />
            <PaperTextInput
              label="Reason"
              value={avoidanceReason}
              onChangeText={setAvoidanceReason}
              multiline
              style={styles.dialogInput}
            />
            <PaperTextInput
              label="Reminder Message (optional)"
              value={avoidanceReminder}
              onChangeText={setAvoidanceReminder}
              multiline
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddAvoidanceDialog(false)}>Cancel</Button>
            <Button onPress={addToAvoidanceList}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightValue: {
    fontSize: 18,
    marginTop: 8,
  },
  insightLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  appName: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  appPackage: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  usageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  usageText: {
    marginLeft: 12,
    flex: 1,
  },
  usageAppName: {
    fontSize: 16,
  },
  usageTime: {
    fontSize: 12,
  },
  usageNotes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  avoidanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avoidanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avoidanceText: {
    marginLeft: 12,
    flex: 1,
  },
  avoidanceAppName: {
    fontSize: 16,
  },
  avoidanceReason: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 12,
  },
});

export default AppUsageScreen; 