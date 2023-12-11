import { object, string } from 'zod';

import { createInsertSchema } from 'drizzle-zod';
import { userProfiles, users } from '@/db/schema';
import { hashPassword } from '../auth';
const createUserFormSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
})
  .pick({ email: true })
  .and(
    createInsertSchema(userProfiles, {
      fullName: (schema) => schema.fullName.min(1).max(256),
    }).pick({ fullName: true })
  )
  .and(object({ password: string().min(8) }));

const serverCreateUserFormSchema = createUserFormSchema.transform(
  async ({ password, ...info }) => ({
    ...info,
    ...(await hashPassword(password)),
  })
);

export { createUserFormSchema, serverCreateUserFormSchema };
