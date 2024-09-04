import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { DB } from '../utils';

@Injectable()
export class ProcurementItemRepo {
  constructor(private client: KyselyService<DB>) {}

  async fetchProcurementItems({
    procurementId,
    organizationId,
  }: {
    procurementId: string;
    organizationId: string;
  }) {
    return this.client
      .selectFrom('Procurement')
      .innerJoin(
        'ProcurementItem',
        'ProcurementItem.procurementId',
        'Procurement.id'
      )
      .select([
        'Procurement.id as procurementId',
        'ProcurementItem.id as procurementItemId',
        'Procurement.status as ProcurementStatus',
        'ProcurementItem.status as procurementItemStatus',
      ])
      .where('Procurement.id', '=', procurementId)
      .where('Procurement.organizationId', '=', organizationId)
      .execute();
  }
}
