import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

const DonateScreen = () => {
  const { theme } = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Card.Content>
          <Title style={[styles.title, { color: theme.colors.primary }]}>Support Anti-G</Title>
          <Paragraph style={[styles.message, { color: theme.colors.text }]}>Scan this QR code and donate as much as you can to support our mission to help people break free from gambling addiction.</Paragraph>
          <Image source={require('../../assets/Donate.png.jpg')} style={styles.qr} resizeMode="contain" />
          <Paragraph style={[styles.quote, { color: theme.colors.textSecondary }]}>"The smallest act of kindness is worth more than the grandest intention."</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    elevation: 4,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  qr: {
    width: 240,
    height: 240,
    marginBottom: 24,
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default DonateScreen; 