import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { OrderRepository } from '../repository';
import {
  ItemStatus,
  OrderFilters,
  UpdateOrderPayload,
  UserData,
} from '../utils';
import { ApproveOrderDto } from './dto/order.dt.';

@Injectable()
export class OrderService {
  constructor(private orderRepo: OrderRepository) {}

  async fetchOrders({
    user,
    searchQuery,
  }: {
    user: UserData;
    searchQuery: OrderFilters;
  }): Promise<IServiceHelper> {
    const cartItems = await this.orderRepo.fetchOrders({ user, searchQuery });
    return {
      status: 'successful',
      message: 'Orders fetched successfully',
      data: cartItems,
    };
  }

  async fetchOrder(param: {
    orderId: string;
    user: UserData;
  }): Promise<IServiceHelper> {
    const order = await this.orderRepo.fetchOrderDetails(param);
    return {
      status: 'successful',
      message: 'Order fetched successfully',
      data: order,
    };
  }

  async confirmOrder(param: {
    orderId: string;
    user: UserData;
    orderItems: ApproveOrderDto;
  }): Promise<IServiceHelper> {
    const order = await this.orderRepo.fetchOrderDetails(param);
    if (!order)
      return {
        status: 'not-found',
        message: 'No order with the given id was found',
      };

    if (order.orderStatus !== 'pending')
      return {
        status: 'bad-request',
        message: 'Order has either been approved or declined',
      };

    const data = order.orderItems
      .map((item) => ({
        id: item.id as string,
        status: param.orderItems.items.some((i) => i.orderItemId === item.id)
          ? 'accepted'
          : 'rejected',
      }))
      .map((item) => ({
        ...item,
        status: item.status as ItemStatus,
      }));

    await this.orderRepo.confirmOrder(param.orderId, data);
    return {
      status: 'successful',
      message: 'Order approved successfully',
    };
  }

  async updateOrder(param: {
    orderId: string;
    user: UserData;
    orderStatus: UpdateOrderPayload;
  }): Promise<IServiceHelper> {
    const { orderStatus, orderId } = param;
    if (param.user.organizationId && param.orderStatus.status === 'cancelled') {
      await this.orderRepo.updateOrder(orderId, orderStatus);
      //   TODO SEND NOTIFICATION
    }
    if (param.user.organizationId && param.orderStatus.status === 'delivered') {
      await this.orderRepo.updateOrder(orderId, orderStatus);
      //   TODO SEND NOTIFICATION
    }
    if (param.user.vendorId && param.orderStatus.status === 'shipped') {
      await this.orderRepo.updateOrder(orderId, orderStatus);
      //   TODO SEND NOTIFICATION
    }

    return {
      status: 'successful',
      message: 'Order updated successfully',
    };
  }
}
