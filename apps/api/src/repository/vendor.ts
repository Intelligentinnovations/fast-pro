import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { DB } from '../utils';
import { UpdateVendorPayload } from '../utils/types/vendor';
@Injectable()
export class VendorRepo {
  constructor(private client: KyselyService<DB>) {}
  async updateVendor({
    vendorId,
    payload,
  }: {
    vendorId: string;
    payload: UpdateVendorPayload;
  }) {
    return this.client
      .updateTable('Vendor')
      .set({ ...payload })
      .where('id', '=', vendorId)
      .execute();
  }
}
