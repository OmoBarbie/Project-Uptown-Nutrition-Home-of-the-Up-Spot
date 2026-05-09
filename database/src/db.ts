import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

neonConfig.webSocketConstructor = WebSocket;

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      const pool = new Pool({ connectionString: 'postgresql://placeholder' });
      db = drizzle({ client: pool, schema });
    }
    else {
      const pool = new Pool({ connectionString });
      db = drizzle({ client: pool, schema });
    }
  }

  return db;
}

export { schema };
export type Database = ReturnType<typeof getDb>;
