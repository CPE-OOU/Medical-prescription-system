import { getServerSession as originalGetServerSession } from 'next-auth';
import argon2 from 'argon2';
import { SALT_LENGTH } from './constant';
import { User, userProfiles, users } from '@/db/schema';
import { cookies, headers } from 'next/headers';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { jsonBuildObject } from './utils';
import { db } from '@/db/init';

import crypto from 'crypto';
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Generates a random salt of a specified length.
 * @param {number} length The desired length of the salt in bytes.
 * @returns {Promise<string>} A promise resolving to the generated salt.
 */
function generateSalt(length: number) {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
}

export const getSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  };
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };

  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await originalGetServerSession(req, res, nextAuthOptions);
  return session;
};

export const getCurrentUser = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return null;
  }

  const { email, emailVerified, id } = getTableColumns(users);
  const { fullName, profileImgUrl, dateOfBirth, gender } =
    getTableColumns(userProfiles);

  const userProfileSelect = jsonBuildObject({
    fullName,
    dateOfBirth,
    profileImgUrl,
    gender,
  });

  const [user] = await db
    .select({
      id,
      email,
      emailVerified,
      profile: sql`${userProfileSelect}` as typeof userProfileSelect,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .where(eq(users.email, session.user.email!));
  return user;
};

export type ClientUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;

export const hashPassword = async (
  plainPassword: string,
  saltLength = SALT_LENGTH
) => {
  const salt = await generateSalt(saltLength);
  const hashedPassword = await argon2.hash(plainPassword, {
    salt: Buffer.from(salt),
    saltLength,
  });

  return {
    salt,
    hashedPassword,
  };
};

export const verifyPassword = async (user: User, enteredPassword: string) => {
  if (!user.hashedPassword) {
    throw new TypeError('Missing hashedPassword on user');
  }

  return await argon2.verify(user.hashedPassword, enteredPassword, {
    salt: Buffer.from(user.passwordSalt!),
  });
};
