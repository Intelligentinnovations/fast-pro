import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class ApprovalItem {
  @ApiProperty()
  procurementItemId!: string;

  @ApiProperty()
  isApproved!: boolean;

  @ApiProperty()
  comment!: string;
}

export class ApproveProcurementDto {
  @ApiProperty({ type: [ApprovalItem], required: true })
  @Type(() => ApprovalItem)
  items!: ApprovalItem[];
}

