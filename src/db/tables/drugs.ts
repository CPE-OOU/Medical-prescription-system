import {
  pgTable,
  uuid,
  varchar,
  json,
  decimal,
  text,
} from 'drizzle-orm/pg-core';

export const drugs = pgTable('drugs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  substitutes: json('substitutes').$type<Array<string>>(),
  effects: json('drug_substitutes').$type<Array<string>>(),
  uses: json('uses').$type<Array<string>>(),
  habitForm: varchar('habit_form', { length: 256 }),
  condition: varchar('condition', { length: 256 }),
  medicalConditionUrl: varchar('medical_condition_url', {
    length: 256,
  }),
  decription: text('description'),
  effective: decimal('effective', { precision: 3 }),
  sideEffect: text('side_effect'),
  drugUrl: varchar('drug_url', { length: 256 }),
  relatedDrugs:
    json('related_drugs').$type<Array<{ drugName: string; link: string }>>(),
  therapeuticClass: varchar('therapeutic_class', { length: 256 }),
});
export type Drug = typeof drugs.$inferSelect;
