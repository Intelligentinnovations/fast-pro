import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
