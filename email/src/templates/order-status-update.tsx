import { Html, Head, Body, Container, Text, Preview } from '@react-email/components';

export function OrderStatusUpdateEmail({ orderNumber, status }: { orderNumber: string; status: string }) {
  const messages: Record<string, string> = {
    out_for_delivery: 'Your order is on its way!',
    delivered: 'Your order has been delivered. Enjoy!',
  };
  return (
    <Html>
      <Head />
      <Preview>Update on order #{orderNumber}</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Order Update</Text>
          <Text>Order #{orderNumber}</Text>
          <Text>{messages[status] ?? `Status updated to: ${status}`}</Text>
        </Container>
      </Body>
    </Html>
  );
}
