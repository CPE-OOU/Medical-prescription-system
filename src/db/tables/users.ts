import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  hashedPassword: text('hashed_password').notNull(),
  passwordSalt: text('password_salt').notNull(),
});

export type User = typeof users.$inferSelect;
