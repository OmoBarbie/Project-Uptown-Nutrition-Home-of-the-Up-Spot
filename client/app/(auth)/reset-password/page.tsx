'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get('token') ?? '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    startTransition(async () => {
      const { error } = await authClient.resetPassword({ newPassword: password, token });
      if (error) { setError(error.message ?? 'Reset failed'); return; }
      router.push('/login?reset=1');
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
          {isPending ? 'Saving…' : 'Set password'}
        </button>
      </form>
    </div>
  );
}
