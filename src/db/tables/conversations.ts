import { relations } from 'drizzle-orm';
import { recordTimestamps } from './../shared-table-columns';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { messages } from './message';
import { users } from './users';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  pinned: timestamp('pinned'),
  title: varchar('title'),
  ...recordTimestamps,
});

export type Conversation = typeof conversations.$inferSelect;

export const conservationRelation = relations(conversations, ({ many }) => ({
  message: many(messages),
}));
