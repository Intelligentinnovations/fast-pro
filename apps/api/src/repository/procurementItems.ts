import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { DB } from '../utils';

@Injectable()
export class ProcurementItemRepo {
  constructor(private client: KyselyService<DB>) {}

  async fetchProcurementWithItems({
    procurementId,
    organizationId,
  }: {
    procurementId: string;
    organizationId: string;
  }) {
    const result = await this.client
      .selectFrom('Procurement')
      .innerJoin(
        'ProcurementItem',
        'ProcurementItem.procurementId',
        'Procurement.id'
      )
      .innerJoin('Product', 'ProcurementItem.productId', 'Product.id')
      .innerJoin('Vendor', 'Product.vendorId', 'Vendor.id')
      .innerJoin('User', 'Procurement.userId', 'User.id')
      .innerJoin('Organization', 'User.organizationId', 'Organization.id')
      .select([
        'Procurement.id as procurementId',
        'Procurement.itemDetails',
        'Procurement.requiredDate',
        'Procurement.paymentTerms',
        'Procurement.status as procurementStatus',
        'Procurement.amount as procurementAmount',
        'User.firstname',
        'User.lastname',
        'Organization.name as organizationName',
        'ProcurementItem.id as procurementItemId',
        'ProcurementItem.status as procurementItemStatus',
        'ProcurementItem.productId',
        'ProcurementItem.variantId',
        'ProcurementItem.quantity',
        'ProcurementItem.unitPrice',
        'ProcurementItem.productName',
        'ProcurementItem.productImage',
        'Vendor.id as vendorId',
        'Vendor.name as vendorName',
      ])
      .where('Procurement.id', '=', procurementId)
      .where('Procurement.organizationId', '=', organizationId)
      .execute();

    if (result.length === 0) {
      return null;
    }
    return {
      procurementId: result[0]?.procurementId,
      itemDetails: result[0]?.itemDetails,
      requiredDate: result[0]?.requiredDate,
      paymentTerms: result[0]?.paymentTerms,
      procurementStatus: result[0]?.procurementStatus,
      procurementAmount: result[0]?.procurementAmount,
      organizationName: result[0]?.organizationName,
      requestedBy: `${result[0]?.firstname} ${result[0]?.lastname}`,
      procurementItems: result.map((item) => ({
        procurementItemId: item.procurementItemId,
        procurementItemStatus: item.procurementItemStatus,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
      })),
    };
  }
}
