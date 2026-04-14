import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// Ensure environment variables are loaded
config();

const isDemoMode = process.env.DEMO_MODE === 'true';

if (!process.env.DATABASE_URL && !isDemoMode) {
  throw new Error(
    'DATABASE_URL is required. Set DEMO_MODE=true to run without a database.'
  );
}

// In demo mode, export null — DB-backed routes are not reachable from the demo UI.
export const db = process.env.DATABASE_URL
  ? drizzle(
      postgres(process.env.DATABASE_URL, {
        ssl: { rejectUnauthorized: false },
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      })
    )
  : null;
