import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Enable WebSocket mode for Neon
neonConfig.webSocketConstructor = WebSocket;

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // During build time, return a mock db instance
      // In production, DATABASE_URL will be set by the deployment platform
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // Return a placeholder during build
      const pool = new Pool({ connectionString: 'postgresql://placeholder' });
      db = drizzle(pool, { schema });
      console.log('here 2')
    } else {
      const pool = new Pool({ connectionString });
      db = drizzle(pool, { schema });
      console.log('here')
    }
  }

  return db;
}

export { schema };
export type Database = ReturnType<typeof getDb>;
