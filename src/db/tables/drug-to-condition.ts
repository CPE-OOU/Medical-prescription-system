import { decimal, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
export const drug2Conditions = pgTable('drug_2_conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  drugName: varchar('drug_name', { length: 256 }).notNull(),
  condition: varchar('condition', { length: 256 }).notNull(),
  effective: decimal('effective', { precision: 3, scale: 2 }),
  sideEffect: varchar('side_effect', { length: 256 }),
  drugUrl: varchar('drug_url', { length: 256 }),
});
