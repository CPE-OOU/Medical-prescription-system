import { object, string } from 'zod';

import { createInsertSchema } from 'drizzle-zod';
import { userProfiles, users } from '@/db/schema';
import { hashPassword } from '../auth';
import { password } from 'bun';
const createUserFormSchema = object({
  email: string().email(),
  fullName: string().min(1).max(256),
  password: string().min(8),
});

const serverCreateUserFormSchema = createUserFormSchema.transform(
  async ({ password, ...info }) => ({
    ...info,
    ...(await hashPassword(password)),
  })
);

export { createUserFormSchema, serverCreateUserFormSchema };
