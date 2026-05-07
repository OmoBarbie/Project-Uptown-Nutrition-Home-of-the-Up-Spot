import { Html, Head, Body, Container, Text, Preview } from '@react-email/components';

export function RefundNotificationEmail({ orderNumber, amount, reason }: { orderNumber: string; amount: string; reason: string }) {
  return (
    <Html>
      <Head />
      <Preview>Refund processed for order #{orderNumber}</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Refund Processed</Text>
          <Text>A refund of ${amount} for order #{orderNumber} has been processed.</Text>
          <Text style={{ color: '#6b7280' }}>Reason: {reason.replace(/_/g, ' ')}</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Funds typically appear in 5-10 business days.</Text>
        </Container>
      </Body>
    </Html>
  );
}
