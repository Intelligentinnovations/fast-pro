import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItem {
  @ApiProperty()
  orderItemId!: string;
}

export class ApproveOrderDto {
  @ApiProperty({ type: [OrderItem], required: true })
  @Type(() => OrderItem)
  items!: OrderItem[];
}
