import type { Config } from 'drizzle-kit';

export default {
  schema:    './src/db/postgres/schema/index.ts',
  out:       './drizzle',
  dialect:   'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://ephemera:ephemera_dev@localhost:5432/ephemera',
  },
} satisfies Config;
