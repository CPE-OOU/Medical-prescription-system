'use server';

import { userProfiles } from '@/db/schema';
import { action } from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
import { object, string } from 'zod';

export const updateProfileImg = action(
  object({
    userId: string().uuid(),
    profileImageUrl: string().url(),
  }),
  async ({ userId, profileImageUrl }) => {
    const [profile] = await db
      .update(userProfiles)
      .set({ profileImgUrl: profileImageUrl })
      .where(eq(userProfiles.userId, userId));

    return profile;
  }
);
