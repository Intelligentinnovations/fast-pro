import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ImageDto {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  isPrimary!: boolean;
}

class SpecificationDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;
}

class VariantDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  quantity!: number;
}

export class AddProductDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  categoryId!: string;
  @ApiProperty()
  price!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: [ImageDto], required: false })
  @Type(() => ImageDto)
  images?: ImageDto[];

  @ApiProperty({ type: [SpecificationDto], required: false })
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto[];

  @ApiProperty({ type: [VariantDto], required: false })
  @Type(() => VariantDto)
  variants?: VariantDto[];
}
