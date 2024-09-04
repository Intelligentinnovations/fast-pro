import { string, z } from 'zod';

export const AddProcurementSchema = z.object({
  requiredDate: z.string(),
  itemDetails: z.string(),
  justification: z.string(),
  paymentTerms: z.string(),
  documents: z.array(string()),
});
export type AddProcurementPayload = z.infer<typeof AddProcurementSchema>;

const ProcurementApprovalSchema = z.object({
  procurementItemId: z.string(),
  isAccepted: z.boolean(),
  comment: z.string().optional(),
});

export const ApproveProcurementSchema = z.object({
  items: z.array(ProcurementApprovalSchema)
});

export type ApproveProcurementPayload = z.infer<
  typeof ApproveProcurementSchema
>;


