import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const stories = [
  {
    name: 'Amit',
    story: 'After 10 years of gambling, I finally broke free. The daily check-ins and urge surfing tools helped me stay strong. 200+ days clean!',
    days: 200,
    icon: 'star',
    color: '#4CAF50',
  },
  {
    name: 'Priya',
    story: 'I relapsed many times, but the community support and journaling kept me going. Now I am 90 days bet-free!',
    days: 90,
    icon: 'heart',
    color: '#E91E63',
  },
  {
    name: 'Rahul',
    story: 'The trigger tracker made me realize my patterns. I have not gambled in 45 days and feel in control again.',
    days: 45,
    icon: 'target',
    color: '#2196F3',
  },
];

const SuccessStoriesScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme } = useTheme();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  if (!fontsLoaded) return null;

  return (
    <View style={[styles.background, { backgroundColor: '#E8F5E8' }]}> {/* soft green background */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trophy" size={48} color={theme.colors.primary} />
          <Title style={[styles.title, { fontFamily: 'Inter_700Bold', color: theme.colors.primary }]}>Success Stories</Title>
          <Paragraph style={[styles.subtitle, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Real people. Real recovery. Get inspired by those who broke free from gambling.</Paragraph>
        </View>
        {stories.map((story, idx) => (
          <Card key={idx} style={[styles.storyCard, { backgroundColor: '#fff' }]}> 
            <Card.Content>
              <View style={styles.storyHeader}>
                <MaterialCommunityIcons name={story.icon as any} size={32} color={story.color} />
                <Title style={[styles.storyName, { fontFamily: 'Inter_700Bold', color: story.color }]}>{story.name}</Title>
                <Paragraph style={[styles.storyDays, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{story.days} days clean</Paragraph>
              </View>
              <Paragraph style={[styles.storyText, { fontFamily: 'Inter_400Regular', color: theme.colors.text }]}>{story.story}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  storyCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  storyName: {
    fontSize: 20,
    marginLeft: 8,
    flex: 1,
  },
  storyDays: {
    fontSize: 14,
    marginLeft: 8,
  },
  storyText: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default SuccessStoriesScreen; 