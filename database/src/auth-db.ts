import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

neonConfig.webSocketConstructor = WebSocket;

let _authDb: ReturnType<typeof drizzle> | null = null;

export function getAuthDb() {
  if (!_authDb) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is required — missing from environment')
    }
    const pool = new Pool({ connectionString });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_authDb as any) = drizzle({
      client: pool,
      schema: {
        user: schema.users,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    });
  }
  return _authDb!;
}
