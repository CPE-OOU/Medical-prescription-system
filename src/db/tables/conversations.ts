import { recordTimestamps } from './../shared-table-columns';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  pinned: timestamp('pinned'),
  title: varchar('title'),
  ...recordTimestamps,
});

export type Conversation = typeof conversations.$inferSelect;
