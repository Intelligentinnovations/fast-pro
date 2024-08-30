import { convertAndSendResponse } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import {
  AuthGuard,
  PermissionsGuard,
  RequiredPermission,
} from '../libraries/guards';
import {
  AddProductPayload,
  AddProductSchema,
  PaginationParams,
  Permission,
  UserData,
} from '../utils';
import { AddProductDto } from './dto/addProductDto';
import { ProductService } from './product.service';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_PRODUCT)
  @ApiOperation({ summary: 'Vendor Add Product' })
  @UsePipes(new ZodValidationPipe(AddProductSchema))
  @ApiBody({ type: AddProductDto })
  @ApiOkResponse({ description: `Product created successful` })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createProduct(
    @Body() payload: AddProductPayload,
    @Req() req: FastifyRequest
  ) {
    const vendorId = req?.user?.vendorId as string;
    const data = await this.productService.addProduct({ payload, vendorId });
    return convertAndSendResponse(data);
  }

  @Get('')
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: `Products fetched successful` })
  async fetchProducts(
    @Req() req: FastifyRequest,
    @Query() pagination: PaginationParams
  ) {
    const user = req.user as UserData;
    const data = await this.productService.fetchProducts({ user, pagination });
    return convertAndSendResponse(data);
  }
}
