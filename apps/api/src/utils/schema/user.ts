import { z } from 'zod';

export const CreateAdminAccountSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string(),
  organizationName: z.string(),
});

export const CreateStaffAccountSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  jobTitle: z.string(),
  inviteId: z.string(),
});

export const CreateVendorSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  businessName: z.string(),
  password: z.string(),
  email: z.string().email('Please enter a valid email'),
  phoneNumber: z.string(),
});

export const CompleteAdminRegistrationSchema = z.object({
  sector: z.string(),
  companySize: z.string(),
  logo: z.string().optional(),
  companyId: z.string().optional(),
});

export const CompleteVendorRegistrationSchema = z.object({
  businessRegistrationNumber: z.string(),
  certificateOfRegistration: z.string().optional(),
  taxIdentificationNumber: z.string(),
  sector: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
});

export const UpdateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  biography: z.string().optional(),
  profileImage: z.string().optional(),
});

export const UpdateCompanyProfileSchema = z.object({
  logo: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
});

export type CompleteVendorRegistrationPayload = z.infer<
  typeof CompleteVendorRegistrationSchema
>;
export type UpdateUserProfilePayload = z.infer<typeof UpdateUserProfileSchema>;
export type CompleteAdminRegistrationPayload = z.infer<
  typeof CompleteAdminRegistrationSchema
>;
export type CreateVendorPayload = z.infer<typeof CreateVendorSchema>;
export type CreateStaffAccountPayload = z.infer<
  typeof CreateStaffAccountSchema
>;
export type CreateAdminAccountPayload = z.infer<
  typeof CreateAdminAccountSchema
>;

export type UpdateCompanyProfilePayload = z.infer<
  typeof UpdateCompanyProfileSchema
>;
