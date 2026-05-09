'use client';

import type { Route } from 'next';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[admin sign-in] attempting with email:', email);
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        console.error('[admin sign-in] API error:', result.error);
        setError(result.error.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('[admin sign-in] success, data:', result.data);

      // Check if user has admin or super_admin role
      if (result.data?.user) {
        const user = result.data.user as { role?: string };
        if (user.role !== 'admin' && user.role !== 'super_admin') {
          setError('Unauthorized. Admin access required.');
          setIsLoading(false);
          return;
        }
      }

      router.push(redirect as Route);
      router.refresh();
    } catch (err: unknown) {
      console.error('[admin sign-in] unexpected exception:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.875rem',
          }}>
            <Squares2X2Icon style={{ width: 26, height: 26, color: '#fff' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-bricolage, system-ui)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.025em', margin: 0, lineHeight: 1.2 }}>
            Uptown Nutrition
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.375rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem' }}>
              <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Authorized personnel only
          </p>
        </form>
      </div>
    </div>
  );
}
