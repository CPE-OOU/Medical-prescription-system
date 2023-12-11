import { object, string, ZodError } from 'zod';
import { NextResponse } from 'next/server';

import { createFailResponse, createSuccessResponse } from '@/lib/response';
import { createInvalidPayloadResponse } from '@/lib/utils';

import { StatusCodes } from 'http-status-codes';
import { users } from '@/db/schema';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { db } from '@/db/init';
import { eq } from 'drizzle-orm';

const formSchema = object({ currentPassword: string(), newPassword: string() });

export const PATCH = async (req: Request) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return;
    }
    const body = await req.json();
    const regFormData = await formSchema.parseAsync(body);

    const { currentPassword, newPassword } = regFormData;

    const [userPasswordDetail] = await db
      .select({
        hashedPassword: users.hashedPassword,
        passwordSalt: users.passwordSalt,
      })
      .from(users)
      .where(eq(users.id, user.id));

    if (
      !(await verifyPassword(
        { ...user, ...userPasswordDetail },
        currentPassword
      ))
    ) {
      return createFailResponse(
        {
          title: 'Unauthorized',
          message: 'User credential not a match. Check email or password',
        },
        StatusCodes.UNAUTHORIZED
      );
    }

    const { hashedPassword, salt } = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ hashedPassword, passwordSalt: salt })
      .where(eq(users.id, user.id));

    return createSuccessResponse(
      {
        title: 'Password Updated',
        message: 'Your password now updated',
        data: user,
      },
      StatusCodes.OK
    );
  } catch (e) {
    console.log('[UPDATE PASSWORD]', e);
    if (Object(e) === e) {
      if (e instanceof ZodError) return createInvalidPayloadResponse(e);
    }
    return NextResponse.json((e as any)?.message, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
