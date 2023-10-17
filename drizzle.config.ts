import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { parsedEnv } from './src/config/env';
dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: parsedEnv.DATABASE_URL,
  },
} satisfies Config;
