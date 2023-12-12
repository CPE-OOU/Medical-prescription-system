import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

import {
  createSuccessResponse,
  getRecordAlreadyExistResponse,
} from '@/lib/response';
import { createInvalidPayloadResponse } from '@/lib/utils';

import { StatusCodes } from 'http-status-codes';
import { drugs, userProfiles, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

import { db } from '@/db/init';
import { serverCreateUserFormSchema } from '@/lib/validation/user';
import { searchPayloadSchema } from '@/lib/validation/search';
import { drug2Conditions } from '@/db/tables/drug-to-condition';
import { ilike } from 'drizzle-orm';
import { webScrapeDrugContent } from '@/lib/extract-drug';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { condition } = await searchPayloadSchema.parseAsync(body);

    const drugsToCondition = await db
      .select()
      .from(drug2Conditions)
      .where(ilike(drug2Conditions.condition, condition));

    const formattedDrugs = drugsToCondition.map(({ drugName }) =>
      webScrapeDrugContent(drugName)
    );

    return createSuccessResponse(
      {
        title: 'ACCOUNT CREATED',
        message: 'Your account is succesfully created',
      },
      StatusCodes.OK
    );
  } catch (e) {
    console.log('[GET SEARCH RESULT USER ACCOUNT]', e);
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
