import { string, z } from 'zod';

export const CreateProposalSchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  dateRequired: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  budgetAmount: z.string(),
  description: z.string(),
  termsAndCondition: z.string(),
  additionalDocument: z.string().optional(),
  evaluationCriteria: z.array(string()),
  eligibilityCriteria: z.array(string()),
});

export type CreateProposalPayload = z.infer<typeof CreateProposalSchema>;
