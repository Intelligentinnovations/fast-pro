import { string, z } from 'zod';

export const CreateProposalRequestSchema = z.object({
  proposalId: z.string(),
  title: z.string(),
  summary: z.string(),
  attachments: z.array(string()),
});

export type CreateProposalRequestPayload = z.infer<
  typeof CreateProposalRequestSchema
>;
