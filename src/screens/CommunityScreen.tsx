import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const CommunityScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  if (!fontsLoaded) return null;

  const communitySections = [
    {
      title: 'Support Groups',
      description: 'Connect with others on the same journey',
      icon: 'account-group',
      action: () => navigation.navigate('SupportGroups'),
      color: '#4CAF50',
      backgroundColor: '#E8F5E8'
    },
    {
      title: 'Speak to Someone',
      description: '24/7 helpline for immediate support',
      icon: 'phone-in-talk',
      action: () => navigation.navigate('SpeakToSomeone'),
      color: '#F44336',
      backgroundColor: '#FFEBEE'
    },
    {
      title: 'Online Forums',
      description: 'Join discussions and share experiences',
      icon: 'forum',
      action: () => navigation.navigate('OnlineForums'),
      color: '#2196F3',
      backgroundColor: '#E3F2FD'
    },
    {
      title: 'Local Resources',
      description: 'Find help in your area',
      icon: 'map-marker',
      action: () => navigation.navigate('LocalResources'),
      color: '#9C27B0',
      backgroundColor: '#F3E5F5'
    },
    // Success Stories already present
  ];

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
          <MaterialCommunityIcons name="account-group" size={32} color={theme.colors.primary} />
          <Title style={[styles.thinTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Community</Title>
          <Paragraph style={[styles.thinSubtitle, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Connect with others and find support.</Paragraph>
        </Card.Content>
      </Card>
      
      {communitySections.map((section, index) => (
        <Card key={index} style={[styles.card, { backgroundColor: section.backgroundColor }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                  <MaterialCommunityIcons name={section.icon as any} size={24} color={section.color} />
                </View>
                <View style={styles.sectionText}>
                  <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{section.title}</Title>
                  <Paragraph style={[styles.text, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{section.description}</Paragraph>
                </View>
              </View>
              <TouchableOpacity onPress={section.action} style={[styles.actionButton, { backgroundColor: section.color }]}>
                <Paragraph style={[styles.actionText, { fontFamily: 'Inter_700Bold', color: '#fff' }]}>{section.title}</Paragraph>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}
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
  sectionsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 16,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  thinHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  thinTitle: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  thinSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
  },
});

export default CommunityScreen; 