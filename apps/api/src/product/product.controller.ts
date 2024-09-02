import { convertAndSendResponse } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Get,
  Param,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  Permission,
  ProductFilters,
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
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'productCategoryNames',
    type: Array,
    required: false,
    description: 'Array of product category to filter by',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Filter by min price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Filter by max price',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by price',
    enum: ['price'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
  })
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'Products fetched successfully' })
  async fetchProducts(
    @Req() req: FastifyRequest,
    @Query() searchQuery: ProductFilters
  ) {
    const user = req.user as UserData;
    const data = await this.productService.fetchProducts({
      user,
      query: searchQuery,
    });
    return convertAndSendResponse(data);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Product ID' })
  @ApiOkResponse({ description: 'Product fetched successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    return convertAndSendResponse(product);
  }
}
