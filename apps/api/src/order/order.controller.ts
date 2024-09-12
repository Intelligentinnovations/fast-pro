import { convertAndSendResponse } from '@backend-template/helpers';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard, PermissionsGuard } from '../libraries/guards';
import { OrderStatus, ProductFilters, UserData } from '../utils';
import { OrderService } from './order.service';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    name: 'status',
    required: false,
    description: 'filter by status',
    enum: OrderStatus,
  })
  @ApiQuery({
    name: 'minAmount',
    required: false,
    description: 'Filter by min amount',
  })
  @ApiQuery({
    name: 'maxAmount',
    required: false,
    description: 'Filter by max amount',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by amount',
    enum: ['amount'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
  })
  @ApiOperation({ summary: 'Get orders' })
  @ApiOkResponse({ description: 'Orders fetched successfully' })
  async fetchCart(
    @Req() req: FastifyRequest,
    @Query() searchQuery: ProductFilters
  ) {
    const user = req.user as UserData;
    const data = await this.orderService.fetchOrders({ user, searchQuery });
    return convertAndSendResponse(data);
  }
}
