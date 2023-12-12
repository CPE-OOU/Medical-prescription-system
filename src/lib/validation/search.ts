import { object, string } from 'zod';

export const searchPayloadSchema = object({ condition: string() });
