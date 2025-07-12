import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const TermsAndConditions = () => (
  <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Terms & Conditions</Title>
        <Paragraph style={styles.text}>
Welcome to QuitBet! By using our app, you agree to the following terms and conditions:
{"\n\n"}
1. The app is for informational and support purposes only. It does not provide medical or legal advice.
{"\n"}
2. You are responsible for your own actions and decisions.
{"\n"}
3. We do not guarantee recovery or any specific outcomes.
{"\n"}
4. You must not use the app for any unlawful or harmful activities.
{"\n"}
5. We may update these terms at any time. Continued use means you accept the changes.
{"\n"}
6. For questions, contact us at support@quitbet.in.
{"\n\n"}
Thank you for using QuitBet to support your journey.
        </Paragraph>
      </Card.Content>
    </Card>
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#e3f2fd' },
  container: { padding: 16, justifyContent: 'center' },
  card: { borderRadius: 16, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 16, textAlign: 'left', marginBottom: 4 },
});

export default TermsAndConditions; 