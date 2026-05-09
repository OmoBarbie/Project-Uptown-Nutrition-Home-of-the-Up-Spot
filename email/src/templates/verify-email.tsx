import { Html, Head, Body, Container, Text, Button, Preview } from '@react-email/components';

export function VerifyEmailTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Verify your UptownNutrition account</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Verify your email</Text>
          <Text>Click the button below to verify your UptownNutrition account.</Text>
          <Button href={url} style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 6, display: 'inline-block' }}>
            Verify Email
          </Button>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Link expires in 24 hours. If you didn't create an account, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}
