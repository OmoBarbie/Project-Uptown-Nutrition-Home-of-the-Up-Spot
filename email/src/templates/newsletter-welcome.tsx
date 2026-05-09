import { Html, Head, Body, Container, Text, Button, Preview, Hr } from '@react-email/components';

export function NewsletterWelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Uptown Nutrition wellness community!</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700, color: '#1a3a1a' }}>Welcome to Our Community 🌿</Text>
          <Text style={{ color: '#374151', lineHeight: 1.6 }}>
            Thank you for subscribing to the Uptown Nutrition newsletter! You're now part of our wellness community.
          </Text>
          <Text style={{ color: '#374151', lineHeight: 1.6 }}>
            Expect exclusive menu items, nutrition tips, and special offers delivered right to your inbox.
          </Text>
          <Button href="https://uptownnutrition.com/products" style={{ background: '#c2410c', color: '#fff', padding: '12px 24px', borderRadius: 6, display: 'inline-block', marginTop: 8 }}>
            Shop Now
          </Button>
          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>
            You received this because you subscribed at uptownnutrition.com.{' '}
            <a href={unsubscribeUrl} style={{ color: '#9ca3af' }}>Unsubscribe</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
