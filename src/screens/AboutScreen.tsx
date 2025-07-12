import React from 'react';
import { View, StyleSheet, Linking, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Title, Paragraph, Switch, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const AboutScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  if (!fontsLoaded) return null;

  const sections = [
    {
      title: 'About Anti-G',
      icon: 'information',
      action: () => {},
      description: 'Volunteer-led initiative to help Indians break free from gambling addiction.',
      showArrow: false,
    },
    {
      title: 'Dark Mode',
      icon: 'theme-light-dark',
      action: () => {},
      description: 'Switch between light and dark themes',
      showArrow: false,
      isToggle: true,
    },
    {
      title: 'Social Media',
      icon: 'share-variant',
      action: () => Linking.openURL('https://facebook.com/yourpage'),
      description: 'Connect with us on social platforms',
      showArrow: true,
    },
    {
      title: 'Contact Us',
      icon: 'email',
      action: () => Linking.openURL('mailto:supermariokid1357@gmail.com'),
      description: 'Email: supermariokid1357@gmail.com | Phone: +91-9152987821',
      showArrow: true,
    },
    {
      title: 'App Version',
      icon: 'information-outline',
      action: () => {},
      description: 'v2.1.5',
      showArrow: false,
    },
    {
      title: 'Emergency Support',
      icon: 'phone',
      action: () => Linking.openURL('tel:9152987821'),
      description: 'Call for immediate help',
      showArrow: true,
    },
    {
      title: 'Terms & Conditions',
      icon: 'file-document',
      action: () => (navigation as any).navigate('TermsAndConditions'),
      description: 'Read our terms of service',
      showArrow: true,
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-lock',
      action: () => (navigation as any).navigate('PrivacyPolicy'),
      description: 'Learn about our privacy practices',
      showArrow: true,
    },
    {
      title: 'Donate',
      icon: 'credit-card',
      action: () => navigation.navigate('Donate'),
      description: 'Support our mission to help more people',
      showArrow: true,
    },
  ];

  const supportSections = [
    {
      title: 'Send Us Email',
      description: 'Get in touch with our support team',
      icon: 'email',
      action: () => Linking.openURL('mailto:supermariokid1357@gmail.com'),
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
      action: () => Linking.openURL('mailto:supermariokid1357@gmail.com'),
      color: '#FF9800',
      backgroundColor: '#FFF3E0'
    },
    {
      title: 'Share Your Feedback',
      description: 'Help us improve our app',
      icon: 'message-text',
      action: () => Linking.openURL('mailto:supermariokid1357@gmail.com'),
      color: '#9C27B0',
      backgroundColor: '#F3E5F5'
    }
  ];

  const Content = () => (
    <ScrollView style={[styles.scroll, { backgroundColor: 'transparent' }]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="information" size={48} color={theme.colors.primary} />
        <Title style={[styles.mainTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>About Anti-G</Title>
        <Paragraph style={[styles.mainDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}> 
          Anti-G is a volunteer-led initiative to help Indians break free from gambling addiction. We provide support, motivation, and a safe community for your recovery journey. For any help, contact us at:
          <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}> supermariokid1357@gmail.com</Text>
        </Paragraph>
      </View>

      <View style={[styles.sectionsContainer, { backgroundColor: theme.colors.card }]}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={section.title}
            style={[styles.sectionRow, { borderBottomColor: theme.colors.border }]}
            onPress={section.action}
            activeOpacity={0.7}
            disabled={!section.showArrow && !section.isToggle}
          >
            <View style={styles.sectionContent}>
              <MaterialCommunityIcons 
                name={section.icon as any} 
                size={24} 
                color={theme.colors.primary} 
                style={styles.sectionIcon}
              />
              <View style={styles.sectionText}>
                <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>
                  {section.title}
                </Title>
                <Paragraph style={[styles.sectionDescription, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>
                  {section.description}
                </Paragraph>
              </View>
            </View>
            {section.isToggle ? (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            ) : section.showArrow ? (
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color={theme.colors.primary} 
              />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      {/* Support Sections */}
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Get Support</Title>
          {supportSections.map((section, index) => (
            <Card key={index} style={[styles.supportCard, { backgroundColor: section.backgroundColor }]}>
              <Card.Content>
                <TouchableOpacity style={styles.supportContent} onPress={section.action}>
                  <View style={styles.supportLeft}>
                    <View style={[styles.supportIcon, { backgroundColor: section.color + '20' }]}>
                      <MaterialCommunityIcons name={section.icon as any} size={24} color={section.color} />
                    </View>
                    <View style={styles.supportText}>
                      <Title style={[styles.supportTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>{section.title}</Title>
                      <Paragraph style={[styles.supportDesc, { fontFamily: 'Inter_400Regular', color: theme.colors.textSecondary }]}>{section.description}</Paragraph>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={section.color} />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  return (
    <ImageBackground 
      source={require('../../assets/WholePageB.png')} 
      style={styles.backgroundContainer}
      resizeMode="cover"
    >
      <Content />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
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
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  supportCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 1,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    fontSize: 14,
    lineHeight: 18,
  },
});

export default AboutScreen; 