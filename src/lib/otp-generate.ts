import { generate } from 'otp-generator';
import { TOKEN_LENGTH } from './constant';
import { sql } from 'drizzle-orm';
import { addMinutes } from 'date-fns';
import { User } from '@/db/schema';
import { AuthToken, authAction, authTokens } from '@/db/tables/auth-tokens';
import { db } from '@/db/init';

export async function generateOTP<const T>(
  type: (typeof authAction.enumValues)[number],
  userId: User['id'],
  currentIp: string | null = null
) {
  let authToken!: AuthToken;
  while (true) {
    const tokens = Array.from({ length: 3 }, () =>
      generate(TOKEN_LENGTH, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      })
    );

    const [{ firstToken, secondToken, thirdToken }] = (await db.execute(sql`
          SELECT
              (
                CASE
                  WHEN (
                      SELECT
                        id
                      FROM
                        ${authTokens}
                      WHERE
                        token = ${tokens[0]}
                        AND ${authTokens.action} = ${type}
                      LIMIT
                        1
                    ) IS NULL THEN true::boolean
                  ELSE false::boolean
              END
              ) as "firstToken",
           (
            CASE
                WHEN (
                    SELECT id
                    FROM ${authTokens}
                    WHERE ${authTokens.token} = ${tokens[1]}
                    AND ${authTokens.action} = ${type}
                    LIMIT 1
                    ) IS NULL THEN true::boolean
                ELSE false::boolean
            END
            ) as "secondToken",

            (
              CASE
                  WHEN (
                      SELECT id
                      FROM ${authTokens}
                      WHERE ${authTokens.token} = ${tokens[2]}
                      AND ${authTokens.action} = ${type}
                      LIMIT 1
                      ) IS NULL THEN true::boolean
                  ELSE false::boolean
              END
              ) as "thirdToken"
          `)) as unknown as [
      { firstToken: boolean; secondToken: boolean; thirdToken: boolean }
    ];

    let token;
    if (firstToken) {
      token = tokens[0];
    } else if (secondToken) {
      token = tokens[1];
    } else if (thirdToken) {
      token = tokens[2];
    }

    if (token) {
      [authToken] = await db
        .insert(authTokens)
        .values({
          action: type,
          token,
          userId,
          userIp: currentIp,
          expiresIn: addMinutes(new Date(), 10),
        })
        .returning();
      break;
    }
  }

  return authToken;
}
