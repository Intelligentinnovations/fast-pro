import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  size: z.number().min(1).optional().default(10),
  totalPages: z.number().min(0).optional().default(0),
  totalItems: z.number().min(0).optional().default(0),
});
