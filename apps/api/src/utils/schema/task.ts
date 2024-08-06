import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string(),
  assigneeId: z.string(),
  priority: z.string(),
});

export type CreateTaskPayload = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.string().optional(),
});

export type UpdateTaskPayload = z.infer<typeof UpdateTaskSchema>;
