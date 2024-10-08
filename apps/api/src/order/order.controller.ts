import { convertAndSendResponse } from '@backend-template/helpers';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  OrderFilters,
  OrderStatus,
  Permission,
  UpdateOrderPayload,
  UserData,
} from '../utils';
import { ApproveOrderDto } from './dto/order.dt.';
import { OrderService } from './order.service';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  @RequiredPermission(Permission.VIEW_ORDER)
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
  async fetchOrders(
    @Req() req: FastifyRequest,
    @Query() searchQuery: OrderFilters
  ) {
    const user = req.user as UserData;
    const data = await this.orderService.fetchOrders({ user, searchQuery });
    return convertAndSendResponse(data);
  }

  @Get(':id')
  @RequiredPermission(Permission.VIEW_ORDER)
  @ApiOperation({ summary: 'Get order details' })
  @ApiOkResponse({ description: 'Order details fetched successfully' })
  async fetchOrder(@Req() req: FastifyRequest, @Param('id') orderId: string) {
    const user = req.user as UserData;
    const data = await this.orderService.fetchOrder({ user, orderId });
    return convertAndSendResponse(data);
  }

  @Put(':id/status')
  @RequiredPermission(Permission.UPDATE_ORDER)
  @ApiOperation({ summary: 'Update order' })
  @ApiOkResponse({ description: 'Order updated successfully' })
  async updateOrder(
    @Req() req: FastifyRequest,
    @Body() orderStatus: UpdateOrderPayload,
    @Param('id') orderId: string
  ) {
    const user = req.user as UserData;
    const data = await this.orderService.updateOrder({
      user,
      orderId,
      orderStatus,
    });
    return convertAndSendResponse(data);
  }

  @Put(':id/confirm')
  @RequiredPermission(Permission.UPDATE_ORDER)
  @ApiOperation({ summary: 'Confirm order' })
  @ApiOkResponse({ description: 'Order confirmed successfully' })
  async confirmOrder(
    @Req() req: FastifyRequest,
    @Body() orderItems: ApproveOrderDto,
    @Param('id') orderId: string
  ) {
    const user = req.user as UserData;
    const data = await this.orderService.confirmOrder({
      user,
      orderId,
      orderItems,
    });
    return convertAndSendResponse(data);
  }
}
