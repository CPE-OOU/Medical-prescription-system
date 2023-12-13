import { Drug } from './drugs';
import { relations } from 'drizzle-orm';
import { recordTimestamps } from './../shared-table-columns';
import { json, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { conversations } from './conversations';

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title'),
  serverContent: json('server_content').$type<Drug>(),
  userContent: varchar('user_content', { length: 256 }),
  conversationId: uuid('conservation_id').notNull(),
  sentTime: timestamp('sent_time').notNull(),
  userId: uuid('user_id'),
  ...recordTimestamps,
});

export const messageRelation = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
export type Message = typeof messages.$inferSelect;
