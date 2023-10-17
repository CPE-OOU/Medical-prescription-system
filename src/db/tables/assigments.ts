import { pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { roles } from './roles';

export const assignments = pgTable(
  'assigments',
  {
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),

    roleId: uuid('role_id')
      .references(() => roles.id)
      .notNull(),
  },
  ({ roleId, userId }) => ({
    pk: primaryKey(roleId, userId),
    unq: unique('single_user_role').on(roleId, userId),
  })
);
