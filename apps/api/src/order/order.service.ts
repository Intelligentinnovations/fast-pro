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
}
