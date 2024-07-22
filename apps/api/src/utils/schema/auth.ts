import { z } from 'zod';

export const CreateAdminAccountSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string(),
  organizationName: z.string(),
  sector: z.string(),
  companySize: z.string(),
  logo: z.string().optional(),
  companyId: z.string().optional()
});

export type CreateAdminAccountPayload = z.infer<typeof CreateAdminAccountSchema>;


export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

export type VerifyEmailPayload = z.infer<typeof VerifyEmailSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

