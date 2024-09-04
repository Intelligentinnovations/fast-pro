import { KyselyService } from "@backend-template/database";
import { Injectable } from "@nestjs/common";

import { DB } from "../utils";

@Injectable()
export class ProcurementItemRepo {
  constructor(private client: KyselyService<DB>) { }

  async fetchProcurementItems(procurementId: string) {
    return this.client
      .selectFrom('ProcurementItem')
      .select(['id', 'ProcurementItem.status'])
      .where('ProcurementItem.procurementId', '=', procurementId)
      .execute()

  }
}