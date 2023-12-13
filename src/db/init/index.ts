import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { parsedEnv } from '../../config/env';
import * as schema from '../schema';

declare global {
  var db: PostgresJsDatabase<typeof schema>;
}

const client = postgres(parsedEnv.DATABASE_URL, { max: 1 });
const db = drizzle(client, { schema });

export { db };
