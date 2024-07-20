import { z } from 'zod';

export const schema = {
  PORT: z.coerce.number().optional(),
  REDIS_URL: z.coerce.string(),
  DATABASE_URL: z.coerce.string(),
  AWS_REGION: z.coerce.string().optional(),
  SECRET_KEY: z.coerce.string()

} as const;

export const objectSchema = z.object(schema);
