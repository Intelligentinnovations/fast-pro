import { z } from 'zod';



export const CreateInviteSchema = z.object({
  email: z.string().email(),
  roleId: z.string(),
  departmentId: z.string(),
});

export type CreateInvitePayload = z.infer<typeof CreateInviteSchema>;

export const UpdateInviteSchema = z.object({
  roleId: z.string(),
  departmentId: z.string(),
});

export type UpdateInvitePayload = z.infer<typeof UpdateInviteSchema>;

export const StaffRegistrationSchema = z.object({
  firstname: z.string().email(),
  lastname: z.string(),
  password: z.string(),
});

export type StaffRegistrationPayload = z.infer<typeof StaffRegistrationSchema>;
