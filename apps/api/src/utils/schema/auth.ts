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


export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

export type VerifyOtpPayload = z.infer<typeof VerifyOtpSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginPayload = z.infer<typeof LoginSchema>;



export const CreateStaffAccountSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  jobTitle: z.string(),
  inviteId: z.string(),
});

export type CreateStaffAccountPayload = z.infer<typeof CreateStaffAccountSchema>;


export const EmailSchema = z.object({
  email: z.string().email(),
});

export type EmailPayload = z.infer<typeof EmailSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;
