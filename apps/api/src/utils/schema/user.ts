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

export const CreateStaffAccountSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  jobTitle: z.string(),
  inviteId: z.string(),
});

export type CreateStaffAccountPayload = z.infer<typeof CreateStaffAccountSchema>;



export const CreateVendorSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  businessName: z.string(),
  password: z.string(),
  email: z.string().email('Please enter a valid email'),
  phoneNumber: z.string()
});

export type CreateVendorPayload = z.infer<typeof CreateVendorSchema>;


export const CompleteVendorRegistrationSchema = z.object({
  businessRegistrationNumber: z.string(),
  certificateOfRegistration: z.string().optional(),
  taxIdentificationNumber: z.string(),
  sector: z.string(),
  description: z.string().optional(),
  logo: z.string().optional()
});

export type CompleteVendorRegistrationPayload = z.infer<typeof CompleteVendorRegistrationSchema>;

