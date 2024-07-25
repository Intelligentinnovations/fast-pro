import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @ApiOperation({ summary: 'Vendor add products' })
  // @ApiBody({ schema: zodToApi() })
  @ApiOkResponse({ description: `Otp verified successful` })
  @ApiBadRequestResponse({ description: 'Invalid Otp' })
  // @UsePipes(new ZodValidationPipe())
  async validateOtp(@Body() payload: { na: string }) {
    const data = await this.productService.createProduct();
    return convertAndSendResponse(data);
  }
}
