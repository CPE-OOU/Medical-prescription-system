'use server';

import { db } from '@/db/init';
import { conversations } from '@/db/tables/conversations';
import { action } from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { revalidatePath } from 'next/cache';

export const updateConversationTitle = action(
  createInsertSchema(conversations, {
    id: (schema) => schema.id.uuid(),
    title: (schema) => schema.title.min(1).max(256),
  }).pick({ id: true, title: true }),
  async ({ id, title }) => {
    await db
      .update(conversations)
      .set({ title })
      .where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);

export const pinConservation = action(
  createInsertSchema(conversations, {
    id: (schema) => schema.id.uuid(),
  }).pick({ id: true }),
  async ({ id }) => {
    await db
      .update(conversations)
      .set({ pinned: new Date() })
      .where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);

export const removeConversation = action(
  createInsertSchema(conversations, {
    id: (schema) => schema.id.uuid(),
  }).pick({ id: true }),
  async ({ id }) => {
    await db.delete(conversations).where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);
