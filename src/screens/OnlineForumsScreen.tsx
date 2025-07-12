import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const forums = [
  { name: 'Reddit: r/StopGambling', link: 'https://www.reddit.com/r/StopGambling/' },
  { name: 'Telegram: QuitGamble India', link: 'https://t.me/quitgambleindia' },
  { name: 'Reddit: r/problemgambling', link: 'https://www.reddit.com/r/problemgambling/' },
];

const OnlineForumsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={[styles.title, { color: theme.colors.primary }]}>Online Forums</Title>
        {forums.map((forum, idx) => (
          <Card key={idx} style={styles.card}>
            <TouchableOpacity onPress={() => Linking.openURL(forum.link)}>
              <Card.Content>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="forum" size={32} color={theme.colors.primary} />
                  <View style={styles.info}>
                    <Title style={styles.forumName}>{forum.name}</Title>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 24, paddingBottom: 140 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  card: { marginBottom: 20, borderRadius: 16, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: 16 },
  forumName: { fontSize: 18 },
});

export default OnlineForumsScreen; 