import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { AddProcurementPayload } from '../procurement/dto/addProcurementDto';
import { CartItems, DB, paginate, ProcurementFilters } from '../utils';

@Injectable()
export class ProcurementRepo {
  constructor(private client: KyselyService<DB>) {}

  async createProcurement(
    procurementPayload: AddProcurementPayload & {
      userId: string;
      organizationId: string;
      amount: string;
      documents: string[];
    },
    cartItems: CartItems[]
  ) {
    return this.client.transaction().execute(async (trx) => {
      const procurement = await trx
        .insertInto('Procurement')
        .values({ ...procurementPayload })
        .returning('id')
        .executeTakeFirst();

      const procurementItems = cartItems.map(
        ({ productId, variantId, quantity, price, total }) => ({
          procurementId: procurement?.id as string,
          productId,
          variantId,
          quantity,
          unitPrice: price.toString(),
          totalPrice: total.toString(),
        })
      );
      await trx
        .insertInto('ProcurementItem')
        .values(procurementItems)
        .execute();
    });
  }

  async fetchProcurements({
    organizationId,
    query,
  }: {
    organizationId: string;
    query: ProcurementFilters;
  }) {
    const { status, sortOrder, sortBy } = query;
    let queryBuilder = this.client
      .selectFrom('Procurement')
      .innerJoin('User', 'Procurement.userId', 'User.id')
      .select(['Procurement.id', 'User.firstname'])
      .where('organizationId', '=', organizationId);
    if (status) {
      queryBuilder = queryBuilder.where('status', '=', status);
    }
    if (sortBy === 'createdAt') {
      queryBuilder = queryBuilder.orderBy('created_at', sortOrder);
    }
    return paginate({ queryBuilder, pagination: query, identifier: 'id' });
  }

  async fetchProcurementById(id: string) {
    return this.client
      .selectFrom('Procurement')
      .innerJoin(
        'ProcurementItem',
        'ProcurementItem.procurementId',
        'Procurement.id'
      )
      .select([
        'id as procurementId',
        'Procurement.status',
        'Procurement.amount',
        'Procurement.itemDetails',
        'Procurement.justification',
        'Procurement.documents',
        'Procurement.requiredDate',
      ]);
  }
}
