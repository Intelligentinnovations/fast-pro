import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  ApproveProcurementPayload,
  CartItems,
  DB,
  paginate,
  ProcurementFilters,
  ProcurementStatus,
  UpdateProcurementItem,
} from '../utils';
import { AddProcurementPayload } from '../utils/schema/procurement';

@Injectable()
export class ProcurementRepo {
  constructor(private client: KyselyService<DB>) { }

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
      .select([
        'Procurement.id',
        'User.firstname',
        'User.lastname',
        'itemDetails',
        'amount',
        'Procurement.status',
      ])
      .where('User.organizationId', '=', organizationId);
    if (status) {
      queryBuilder = queryBuilder.where('Procurement.status', '=', status);
    }
    if (sortBy === 'createdAt') {
      queryBuilder = queryBuilder.orderBy('Procurement.created_at', sortOrder);
    }
    return paginate({
      queryBuilder,
      pagination: query,
      identifier: 'Procurement.id',
    });
  }

  async fetchProcurementById({
    id,
    organizationId,
  }: {
    id: string;
    organizationId: string;
  }) {
    const procurementWithItems = await this.client
      .selectFrom('Procurement')
      .leftJoin(
        'ProcurementItem',
        'ProcurementItem.procurementId',
        'Procurement.id'
      )
      .leftJoin('User', 'Procurement.userId', 'User.id')
      .leftJoin('Department', 'User.departmentId', 'Department.id')
      .select([
        'Procurement.id',
        'Procurement.status',
        'Procurement.amount',
        'Procurement.itemDetails',
        'Procurement.justification',
        'Procurement.documents',
        'User.firstname',
        'Department.name as department',
        'User.lastname',
        'Procurement.requiredDate',
        'ProcurementItem.id as itemId',
        'ProcurementItem.productId',
        'ProcurementItem.variantId',
        'ProcurementItem.quantity',
        'ProcurementItem.unitPrice',
        'ProcurementItem.totalPrice',
      ])
      .where('Procurement.id', '=', id)
      .where('Procurement.organizationId', '=', organizationId)
      .execute();

    if (procurementWithItems.length === 0) {
      return null;
    }
    const procurement = {
      id: procurementWithItems[0]?.id,
      department: procurementWithItems[0]?.department,
      requestedBy: `${procurementWithItems[0]?.firstname} ${procurementWithItems[0]?.lastname}`,
      status: procurementWithItems[0]?.status,
      amount: procurementWithItems[0]?.amount,
      itemDetails: procurementWithItems[0]?.itemDetails,
      justification: procurementWithItems[0]?.justification,
      documents: procurementWithItems[0]?.documents,
      requiredDate: procurementWithItems[0]?.requiredDate,
      procurementItems: procurementWithItems.map((item) => ({
        id: item.itemId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      total: procurementWithItems.reduce(
        (sum, item) => sum + (Number(item.totalPrice) || 0),
        0
      ),
    };

    return procurement;
  }
  async approveProcurement({ payload, procurementStatus }: { payload: UpdateProcurementItem[]; procurementStatus: ProcurementStatus }) {
    await this.client.transaction().execute(async (trx) => {
      for (const update of payload) {
        await trx
          .updateTable('ProcurementItem')
          .set(update)
          .where('id', '=', update.procurementItemId)
          .execute()
      }
      await trx.updateTable('Procurement').set({ status: procurementStatus }).execute()
    })
  }
}
