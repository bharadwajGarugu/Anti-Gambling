import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { Title, Paragraph, Switch, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

interface SlideOutDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SlideOutDrawer: React.FC<SlideOutDrawerProps> = ({ visible, onClose }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation() as any;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!fontsLoaded) return null;

  const sections = [
    {
      title: 'About QuitBet',
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
      action: () => Linking.openURL('mailto:support@quitbet.in'),
      description: 'Email: support@quitbet.in | Phone: +91-9152987821',
      showArrow: true,
    },
    {
      title: 'App Version',
      icon: 'information-outline',
      action: () => {},
      description: 'v1.0.0',
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
      action: () => navigation.navigate('TermsAndConditions'),
      description: 'Read our terms of service',
      showArrow: true,
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-lock',
      action: () => navigation.navigate('PrivacyPolicy'),
      description: 'Learn about our privacy practices',
      showArrow: true,
    },
    {
      title: 'Donate',
      icon: 'credit-card',
      action: () => Linking.openURL('https://pages.razorpay.com/quitbet-india'),
      description: 'Support our mission to help more people',
      showArrow: true,
    },
    {
      title: 'New Features',
      icon: 'star',
      action: () => navigation.navigate('FeaturesShowcase'),
      description: 'Explore our latest features and capabilities',
      showArrow: true,
    },
    {
      title: 'App Usage Tracker',
      icon: 'cellphone',
      action: () => navigation.navigate('AppUsage'),
      description: 'Track your app usage and manage avoidance lists',
      showArrow: true,
    },
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

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          backgroundColor: theme.colors.background,
          width: '100%',
          height: '100%',
        }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Title style={[styles.headerTitle, { fontFamily: 'Inter_700Bold', color: theme.colors.text }]}>Menu</Title>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60, // Much more top padding for status bar
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 16,
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

export default SlideOutDrawer; 