'use server';

import { db } from '@/db/init';
import { conversations, drugs, messages } from '@/db/schema';
import { action } from '@/lib/safe-action';
import { eq, ilike } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { object, string, date } from 'zod';

export const updateConversationTitle = action(
  object({
    id: string().uuid(),
    title: string().min(1).max(256),
  }),
  async ({ id, title }) => {
    await db
      .update(conversations)
      .set({ title })
      .where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);

export const pinConservation = action(
  object({
    id: string().uuid(),
  }),
  async ({ id }) => {
    await db
      .update(conversations)
      .set({ pinned: new Date() })
      .where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);

export const removeConversation = action(
  object({
    id: string().uuid(),
  }),
  async ({ id }) => {
    await db.delete(conversations).where(eq(conversations.id, id!));

    revalidatePath('/');
  }
);

export const createMessage = action(
  object({
    conversationId: string().uuid().optional(),
    message: string().max(256),
    userId: string().uuid(),
    sentTime: date(),
  }),
  async ({ conversationId, userId, message: data }) => {
    if (conversationId) {
      const drugsToCondition = await db
        .select()
        .from(drugs)
        .where(ilike(drugs.condition, data));

      Promise.allSettled(
        drugsToCondition.map((drug) =>
          db.insert(messages).values({
            sentTime: new Date(),
            conversationId,
            serverContent: drug,
            userId,
            title: drug.name,
          })
        )
      );

      await db.insert(messages).values({
        userContent: data,
        conversationId,
        userId,
        sentTime: new Date(),
      });

      revalidatePath(`/chat/${conversationId}`);
    } else {
      const [conversation] = await db
        .insert(conversations)
        .values({ title: data, userId })
        .returning();
      const drugsToCondition = await db
        .select()
        .from(drugs)
        .where(ilike(drugs.condition, data));

      Promise.allSettled(
        drugsToCondition.map((drug) =>
          db.insert(messages).values({
            sentTime: new Date(),
            conversationId: conversation.id,
            serverContent: drug,
            userId,
            title: drug.name,
          })
        )
      );

      await db.insert(messages).values({
        userContent: data,
        title: data,
        userId,
        conversationId: conversation.id,
        sentTime: new Date(),
      });

      redirect(`/chat/${conversation.id}`);
    }
  }
);
