import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  CreateOrderPayload,
  DB,
  Order,
  OrderFilters,
  paginate,
  UserData,
} from '../utils';

@Injectable()
export class OrderRepository {
  constructor(private readonly client: KyselyService<DB>) {}

  async create(orderPayload: CreateOrderPayload): Promise<void> {
    return this.client.transaction().execute(async (transaction) => {
      const { orderItems, ...orderDetails } = orderPayload;
      const order = await transaction
        .insertInto('Order')
        .values(orderDetails)
        .returning('id')
        .executeTakeFirstOrThrow();

      const orderItemsWithOrderId = orderItems.map((i) => ({
        ...i,
        orderId: order.id,
      }));
      await transaction
        .insertInto('OrderItem')
        .values(orderItemsWithOrderId)
        .execute();
    });
  }

  async fetchOrders({
    user,
    searchQuery,
  }: {
    user: UserData;
    searchQuery: OrderFilters;
  }) {
    const isVendor = Boolean(user.vendorId);

    let query = this.client
      .selectFrom('Order')
      .select([
        'Order.id as orderId',
        'itemDetails',
        'Order.created_at as createdAt',
        'status',
        'organizationName',
        'requiredDate',
      ]);

    if (searchQuery.status) {
      query = query.where('Order.status', '=', searchQuery.status);
    }

    if (searchQuery.sortBy === 'amount') {
      query = query.orderBy('Order.amount', searchQuery.sortOrder);
    }

    if (searchQuery.status) {
      query = query.where('Order.status', '=', searchQuery.status);
    }

    query = isVendor
      ? query
          .innerJoin('Organization', 'Organization.id', 'Order.organizationId')
          .where('Order.vendorId', '=', user.vendorId ?? '')
          .select(['Organization.name as organizationName'])
      : query.where('Order.organizationId', '=', user.organizationId ?? '');

    return paginate<Order>({
      queryBuilder: query,
      pagination: searchQuery,
      identifier: 'Order.id',
    });
  }

  async fetchOrderDetails(param: { orderId: string; user: UserData }) {
    return this.client
      .selectFrom('Order')
      .leftJoin('OrderItem', 'OrderItem.orderId', 'Order.id')
      .select([
        'Order.id',
        'organizationId',
        'organizationName',
        'status',
        'requiredDate',
        'created_at',
        'requestedBy',
        'Order.amount',
        'Order.itemDetails',
        'OrderItem.id as orderItemId',
        'OrderItem.productName',
        'OrderItem.vendorName',
        'OrderItem.quantity',
        'OrderItem.unitPrice',
        'OrderItem.totalPrice',
        'OrderItem.productImage',
      ])
      .where('Order.id', '=', param.orderId)
      .$if(param.user.vendorId !== undefined, (qb) =>
        qb.where('Order.vendorId', '=', param.user.vendorId ?? '')
      )
      .$if(param.user.organizationId !== undefined, (qb) =>
        qb.where('Order.organizationId', '=', param.user.organizationId ?? '')
      )
      .execute()
      .then((result) => {
        const order = result[0];
        const orderItems = result.map((item) => ({
          id: item.orderItemId,
          productName: item.productName,
          productImage: item.productImage,
          vendorName: item.vendorName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        }));
        return { ...order, orderItems };
      });
  }
}
