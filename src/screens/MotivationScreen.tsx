import React from 'react';
import { View, StyleSheet, Linking, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme as usePaperTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const MotivationScreen = () => {
  const paperTheme = usePaperTheme();
  const { theme, isDarkMode } = useTheme();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  if (!fontsLoaded) return null;

  const blogArticles = [
    {
      title: "The Psychology of Gambling Addiction: Why the Brain Craves the Bet",
      description: "Understanding the neurological and psychological factors that drive gambling addiction",
      url: "https://equilibriapcs.com/the-psychology-of-gambling-addiction-why-the-brain-craves-the-bet/",
      color: '#4CAF50',
      backgroundColor: '#E8F5E8'
    },
    {
      title: "Gambling and Virtual Reality: Unraveling the Illusion of Near-Misses Effect",
      description: "Research on how virtual reality can help understand and treat gambling behaviors",
      url: "https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1322631/full",
      color: '#2196F3',
      backgroundColor: '#E3F2FD'
    },
    {
      title: "Gambling Poses Huge Global Threat to Public Health, Experts Warn",
      description: "Lancet Commission report on the global impact of gambling addiction",
      url: "https://www.theguardian.com/society/2024/oct/24/gambling-poses-huge-global-threat-to-public-health-experts-warn-lancet-commission",
      color: '#F44336',
      backgroundColor: '#FFEBEE'
    }
  ];

  const motivationFacts = [
    {
      fact: "1 in 3 Indian users have faced serious financial or mental issues due to online betting",
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      icon: 'alert-circle'
    },
    {
      fact: "The brain releases dopamine during gambling, creating the same chemical response as drugs",
      color: '#9C27B0',
      backgroundColor: '#F3E5F5',
      icon: 'brain'
    },
    {
      fact: "Over 5000+ lives are already on the path to recovery with QuitBet",
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      icon: 'account-group'
    },
    {
      fact: "Every day bet-free saves an average of ₹500-2000 that would have been lost",
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
      icon: 'cash-multiple'
    }
  ];

  const supportSections = [
    {
      title: 'Send Us Email',
      description: 'Get in touch with our support team',
      icon: 'email',
      action: () => Linking.openURL('mailto:support@quitbet.in'),
      color: '#4CAF50',
      backgroundColor: '#E8F5E8'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions and answers',
      icon: 'help-circle',
      action: () => {},
      color: '#2196F3',
      backgroundColor: '#E3F2FD'
    },
    {
      title: 'Volunteer With Us',
      description: 'Join our mission to help others',
      icon: 'hand-heart',
      action: () => Linking.openURL('mailto:volunteer@quitbet.in'),
      color: '#FF9800',
      backgroundColor: '#FFF3E0'
    },
    {
      title: 'Share Your Feedback',
      description: 'Help us improve our app',
      icon: 'message-text',
      action: () => Linking.openURL('mailto:feedback@quitbet.in'),
      color: '#9C27B0',
      backgroundColor: '#F3E5F5'
    }
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
          <MaterialCommunityIcons name="lightbulb-on" size={32} color={theme.colors.primary} />
          <Title style={[styles.thinTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Motivation</Title>
          <Paragraph style={[styles.thinSubtitle, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>Find daily inspiration and support for your journey.</Paragraph>
        </Card.Content>
      </Card>



      {/* Blog Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Blog</Title>
          {blogArticles.map((article, index) => (
            <Card key={index} style={[styles.blogCard, { backgroundColor: article.backgroundColor }]} onPress={() => Linking.openURL(article.url)}>
              <Card.Content style={styles.blogContent}>
                <View style={[styles.blogIcon, { backgroundColor: article.color + '20' }]}>
                  <MaterialCommunityIcons name="file-document" size={20} color={article.color} />
                </View>
                <View style={styles.blogText}>
                  <Title style={[styles.blogTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{article.title}</Title>
                  <Paragraph style={[styles.blogDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{article.description}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      {/* Daily Affirmations */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Daily Affirmations</Title>
          <View style={[styles.affirmationCard, { backgroundColor: isDarkMode ? '#1B5E20' : '#E8F5E8' }]}>
            <MaterialCommunityIcons name="format-quote-open" size={24} color={isDarkMode ? '#A5D6A7' : '#4CAF50'} />
            <Paragraph style={[styles.affirmationText, { fontFamily: 'Inter_400Regular', color: isDarkMode ? '#E8F5E8' : theme.colors.text }]}>"Every day bet-free is a victory."</Paragraph>
          </View>
          <View style={[styles.affirmationCard, { backgroundColor: isDarkMode ? '#0D47A1' : '#E3F2FD' }]}>
            <MaterialCommunityIcons name="format-quote-open" size={24} color={isDarkMode ? '#90CAF9' : '#2196F3'} />
            <Paragraph style={[styles.affirmationText, { fontFamily: 'Inter_400Regular', color: isDarkMode ? '#E3F2FD' : theme.colors.text }]}>"You deserve peace and freedom."</Paragraph>
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
    paddingBottom: 100,
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
  blogCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 1,
  },
  blogContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blogIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  blogText: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  blogDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  factCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  factContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  factText: {
    fontSize: 14,
    flex: 1,
  },
  supportCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  supportContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  supportText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  supportDesc: {
    fontSize: 13,
  },
  affirmationCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  affirmationText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  thinHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  thinTitle: {
    fontSize: 20,
    marginTop: 4,
    marginBottom: 2,
  },
  thinSubtitle: {
    fontSize: 14,
  },
});

export default MotivationScreen; 