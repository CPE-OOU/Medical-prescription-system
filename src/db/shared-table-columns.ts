import { timestamp } from 'drizzle-orm/pg-core';

export const recordTimestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updateAt: timestamp('updated_at').defaultNow(),
};
