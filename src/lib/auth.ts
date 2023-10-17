import { getServerSession } from 'next-auth';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import { SALT_LENGTH } from './constant';
import { User } from '@/db/schema';

export const getSession = () => getServerSession();

export const hashPassword = async (
  plainPassword: string,
  saltLength = SALT_LENGTH
) => {
  const salt = await bcrypt.genSalt(saltLength);
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
