import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;

export const DeleteAccountSchema = z.object({
  password: z.string(),
});

export type DeleteAccountPayload = z.infer<typeof DeleteAccountSchema>;
