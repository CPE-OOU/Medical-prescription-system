import { decimal, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
export const drug2Conditions = pgTable('drug_2_conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  drugName: varchar('drug_name', { length: 256 }).notNull(),
  condition: varchar('condition', { length: 256 }).notNull(),
  effective: decimal('effective', { precision: 3, scale: 2 }),
  reviews: varchar('side_effect', { length: 256 }),
  reviewsLength: decimal('revies_length', { precision: 3 }),
});
