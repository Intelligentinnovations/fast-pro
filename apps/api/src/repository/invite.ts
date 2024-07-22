import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { paginate } from '../utils/paginate';
import { CreateInvitePayload } from '../utils/schema/staff';
import { DB, Invite } from '../utils/types';
import { PaginationParams } from '../utils/types/paginationParams';
@Injectable()
export class InviteRepo {
  constructor(
    private client: KyselyService<DB>,
  ) {
  }

  async createInvite(payload: CreateInvitePayload & { organizationId: string }) {
    return this.client
      .insertInto('Invite')
      .values(payload)
      .returning(['organizationId', 'email', 'id', 'departmentId', 'roleId'])
      .execute()

  }
  async deleteInvite({organizationId, id}:{ organizationId: string, id: string}) {
    return this.client
      .deleteFrom('Invite')
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .execute()

  }
  async fetchInvite({organizationId, id}:{ organizationId: string, id: string}) {
    return this.client
      .selectFrom('Invite')
      .selectAll()
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .executeTakeFirst()

  }
  async fetchInvites({pagination, organizationId}: {pagination: PaginationParams; organizationId: string}) {
    const queryBuilder = this.client
      .selectFrom('Invite')
      .where('organizationId', '=', organizationId)
      .selectAll();
    return paginate<Invite>(queryBuilder, pagination);

  }



}
