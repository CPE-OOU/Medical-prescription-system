import { boolean, pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const accountSettings = pgTable('account_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  setupCompleted: boolean('setup_completed').default(false),
});

export const accountSettingRelations = relations(
  accountSettings,
  ({ one }) => ({
    user: one(users, {
      fields: [accountSettings.userId],
      references: [users.id],
    }),
  })
);

export type AccountSetting = typeof accountSettings.$inferSelect;
