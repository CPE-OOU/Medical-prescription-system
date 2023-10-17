import { pgTable, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { permissions } from './permissions';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .references(() => roles.id)
      .notNull(),
    permissionId: uuid('permission_id')
      .references(() => permissions.id)
      .notNull(),
  },
  ({ roleId, permissionId }) => ({
    pk: primaryKey(roleId, permissionId),
    unq: unique('single_role_permission').on(roleId, permissionId),
  })
);
