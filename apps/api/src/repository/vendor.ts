import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { paginate } from '../utils';
import { DB, Invite } from '../utils';
import { PaginationParams } from '../utils';
import { CreateInvitePayload } from '../utils/schema/staff';
import { UpdateInvitePayload } from '../utils/types/invite';
import { UpdateVendorPayload } from '../utils/types/vendor';
@Injectable()
export class VendorRepo {
  constructor(
    private client: KyselyService<DB>,
  ) {
  }
  async updateVendor({vendorId, payload}: {
    vendorId: string;
    payload: UpdateVendorPayload
  }) {
    return this.client
      .updateTable('Vendor')
      .set({...payload})
      .where('id', '=', vendorId)
      .execute()
  }

  async getVendorByEmail() {

  }
}
