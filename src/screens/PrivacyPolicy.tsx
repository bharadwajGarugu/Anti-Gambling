import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const PrivacyPolicy = () => (
  <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Privacy Policy</Title>
        <Paragraph style={styles.text}>
We value your privacy. This policy explains how we handle your information:
{"\n\n"}
1. We do not collect personal data unless you provide it (e.g., email for support).
{"\n"}
2. Your data is never sold or shared with third parties.
{"\n"}
3. We use analytics to improve the app, but this data is anonymized.
{"\n"}
4. You can contact us at support@quitbet.in to request deletion of your data.
{"\n"}
5. We may update this policy. Continued use means you accept the changes.
{"\n\n"}
Thank you for trusting QuitBet with your privacy.
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

export default PrivacyPolicy; 