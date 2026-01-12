'use client';

import { authClient } from '@/lib/auth-client';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <authClient.Provider>
      {children}
    </authClient.Provider>
  );
}
