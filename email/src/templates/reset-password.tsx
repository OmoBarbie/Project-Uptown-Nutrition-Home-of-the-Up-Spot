import { Html, Head, Body, Container, Text, Button, Preview } from '@react-email/components';

export function ResetPasswordTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Tayo password</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Reset your password</Text>
          <Text>Click the button below to choose a new password.</Text>
          <Button href={url} style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 6, display: 'inline-block' }}>
            Reset Password
          </Button>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Link expires in 1 hour. If you didn't request this, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}
