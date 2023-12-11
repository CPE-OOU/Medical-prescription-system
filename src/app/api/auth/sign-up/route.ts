import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

import {
  createSuccessResponse,
  getRecordAlreadyExistResponse,
} from '@/lib/response';
import { createInvalidPayloadResponse } from '@/lib/utils';

import { StatusCodes } from 'http-status-codes';
import { userProfiles, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

import { db } from '@/db/init';
import { serverCreateUserFormSchema } from '@/lib/validation/user';
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const regFormData = await serverCreateUserFormSchema.parseAsync(body);

    const { email, hashedPassword, salt, fullName } = regFormData;

    const user = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({ email, hashedPassword, passwordSalt: salt })
        .returning();

      await tx.insert(userProfiles).values({
        userId: newUser.id,
        fullName,
      });

      return getCurrentUser();
    });

    return createSuccessResponse(
      {
        title: 'ACCOUNT CREATED',
        message: 'Your account is succesfully created',
        data: user,
      },
      StatusCodes.OK
    );
  } catch (e) {
    console.log('[CREATE USER ACCOUNT]', e);
    if (Object(e) === e) {
      if (e instanceof ZodError) return createInvalidPayloadResponse(e);

      if ((e as { code?: string })?.code) {
        const code = (e as { code?: string })?.code as string;
        if (code.toLowerCase() === '23505') {
          return getRecordAlreadyExistResponse({
            title: 'USER ALREADY EXIST',
            message: 'A user already registered with this same email',
          });
        }
      }
    }
    return NextResponse.json((e as any)?.message, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
