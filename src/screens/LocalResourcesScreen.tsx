import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const resources = [
  { name: 'NIMHANS Centre for Well Being', address: 'Bangalore, Karnataka', phone: '+91-80-26685948', link: 'https://nimhans.ac.in/' },
  { name: 'Tulasi Healthcare', address: 'New Delhi', phone: '+91-8800000255', link: 'https://www.tulasihealthcare.com/' },
  { name: 'Cadabams Hospitals', address: 'Bangalore, Karnataka', phone: '+91-9741476476', link: 'https://www.cadabams.org/' },
];

const LocalResourcesScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={[styles.title, { color: theme.colors.primary }]}>Local Resources</Title>
        {resources.map((res, idx) => (
          <Card key={idx} style={styles.card}>
            <TouchableOpacity onPress={() => Linking.openURL(res.link)}>
              <Card.Content>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="map-marker" size={32} color={theme.colors.primary} />
                  <View style={styles.info}>
                    <Title style={styles.resName}>{res.name}</Title>
                    <Paragraph style={styles.resAddress}>{res.address}</Paragraph>
                    <Paragraph style={styles.resPhone}>{res.phone}</Paragraph>
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
  resName: { fontSize: 18 },
  resAddress: { fontSize: 14, color: '#666' },
  resPhone: { fontSize: 14, color: '#666' },
});

export default LocalResourcesScreen; 