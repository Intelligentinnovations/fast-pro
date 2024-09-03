import { ApiProperty } from '@nestjs/swagger';
import { string, z } from 'zod';


export class AddProcurementDto {
  @ApiProperty()
  requiredDate!: Date;

  @ApiProperty()
  justification!: string;

  @ApiProperty()
  paymentTerms!: string;

  @ApiProperty()
  itemDetails!: string;

  @ApiProperty()
  documents?: string[];
}


export const AddProcurementSchema = z.object({
  requiredDate: z.string(),
  itemDetails: z.string(),
  justification: z.string(),
  paymentTerms: z.string(),
  documents: z.array(string()),

});
export type AddProcurementPayload = z.infer<typeof AddProcurementSchema>;
