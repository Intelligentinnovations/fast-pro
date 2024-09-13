import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { OrderRepository } from '../repository';
import { OrderFilters, UserData } from '../utils';

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
}
