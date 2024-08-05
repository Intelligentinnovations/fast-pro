import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string(),
  assigneeId: z.string(),
  priority: z.string(),
});

export type CreateTaskPayload = z.infer<typeof CreateTaskSchema>;
