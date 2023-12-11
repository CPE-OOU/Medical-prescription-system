import { date, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const userGender = pgEnum('user_gender', ['male', 'female']);

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  fullName: varchar('full_name', { length: 256 }),
  gender: userGender('gender'),
  dateOfBirth: date('date_of_birth'),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export const userProfilesRelation = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));
