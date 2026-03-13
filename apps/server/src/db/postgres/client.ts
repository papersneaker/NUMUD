import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool }    from 'pg';
import * as schema from './schema/index.js';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'] ?? 'postgresql://ephemera:ephemera_dev@localhost:5432/ephemera',
});

export const db = drizzle(pool, { schema });
export type DB   = typeof db;
