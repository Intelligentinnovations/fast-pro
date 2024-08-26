import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { DB } from '../utils';
import { UpdateOrganizationPayload } from '../utils/types/organization';

@Injectable()
export class OrganizationRepo {
  constructor(private client: KyselyService<DB>) {}
  async updateOrganization({
    organizationId,
    payload,
  }: {
    organizationId: string;
    payload: UpdateOrganizationPayload;
  }) {
    return this.client
      .updateTable('Organization')
      .set(payload)
      .where('id', '=', organizationId)
      .execute();
  }
  async getProfile(organizationId: string) {
    return this.client
      .selectFrom('Organization')
      .select([
        'id',
        'logo',
        'email',
        'sector',
        'address',
        'description',
        'name',
        'phoneNumber',
        'companyId',
        'companySize',
      ])
      .where('id', '=', organizationId)
      .execute();
  }
}
