import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const helplines = [
  { name: 'National Gambling Helpline', number: '1800-599-0019' },
  { name: 'Suicide Prevention India', number: '9152987821' },
  { name: 'Snehi India Emotional Support', number: '91-22-2772 6771' },
];

const SpeakToSomeoneScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={[styles.title, { color: theme.colors.primary }]}>Speak to Someone</Title>
        {helplines.map((line, idx) => (
          <Card key={idx} style={styles.card}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${line.number.replace(/\s/g, '')}`)}>
              <Card.Content>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="phone" size={32} color={theme.colors.primary} />
                  <View style={styles.info}>
                    <Title style={styles.lineName}>{line.name}</Title>
                    <Paragraph style={styles.lineNumber}>{line.number}</Paragraph>
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
  lineName: { fontSize: 18 },
  lineNumber: { fontSize: 14, color: '#666' },
});

export default SpeakToSomeoneScreen; 