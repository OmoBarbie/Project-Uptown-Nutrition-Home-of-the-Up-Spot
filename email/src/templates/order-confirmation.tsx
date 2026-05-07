import { Html, Head, Body, Container, Text, Preview, Hr } from '@react-email/components';

interface Props {
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: string }[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: string;
}

export function OrderConfirmationEmail({ orderNumber, items, subtotal, tax, deliveryFee, total, deliveryAddress }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Order #{orderNumber} confirmed</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Order Confirmed!</Text>
          <Text>Order #{orderNumber}</Text>
          <Hr />
          {items.map((item, i) => (
            <Text key={i}>{item.quantity}x {item.name} — ${item.unitPrice}</Text>
          ))}
          <Hr />
          <Text>Subtotal: ${subtotal}</Text>
          <Text>Tax: ${tax}</Text>
          <Text>Delivery: ${deliveryFee}</Text>
          <Text style={{ fontWeight: 700 }}>Total: ${total}</Text>
          <Hr />
          <Text style={{ color: '#6b7280' }}>Delivering to: {deliveryAddress}</Text>
        </Container>
      </Body>
    </Html>
  );
}
