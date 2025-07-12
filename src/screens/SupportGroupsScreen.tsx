import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const groups = [
  { name: 'QuitBet Warriors', number: '+91-9876543210', link: 'https://facebook.com/quitbetgroup' },
  { name: 'Recovery Champions', number: '+91-9123456780', link: 'https://t.me/recoverychampions' },
  { name: 'Freedom Fighters', number: '+91-9988776655', link: 'https://wa.me/919988776655' },
];

const SupportGroupsScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={[styles.title, { color: theme.colors.primary }]}>Support Groups</Title>
        {groups.map((group, idx) => (
          <Card key={idx} style={styles.card}>
            <TouchableOpacity onPress={() => Linking.openURL(group.link)}>
              <Card.Content>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="account-group" size={32} color={theme.colors.primary} />
                  <View style={styles.info}>
                    <Title style={styles.groupName}>{group.name}</Title>
                    <Paragraph style={styles.groupNumber}>{group.number}</Paragraph>
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
  groupName: { fontSize: 18 },
  groupNumber: { fontSize: 14, color: '#666' },
});

export default SupportGroupsScreen; 