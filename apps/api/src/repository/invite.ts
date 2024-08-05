import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  CreateInvitePayload,
  DB,
  Invite,
  paginate,
  PaginationParams,
} from '../utils';
import { UpdateInvitePayload } from '../utils/types/invite';

@Injectable()
export class InviteRepo {
  constructor(private client: KyselyService<DB>) {}

  async createInvite(
    payload: CreateInvitePayload & { organizationId: string }
  ) {
    return this.client
      .insertInto('Invite')
      .values(payload)
      .returning(['organizationId', 'email', 'id', 'departmentId', 'roleId'])
      .execute();
  }

  async deleteInvite({
    organizationId,
    id,
  }: {
    organizationId: string;
    id: string;
  }) {
    return this.client
      .deleteFrom('Invite')
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .execute();
  }

  async fetchOrganizationInvite({
    organizationId,
    id,
  }: {
    organizationId: string;
    id: string;
  }) {
    return this.client
      .selectFrom('Invite')
      .selectAll()
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async fetchInvites({
    pagination,
    organizationId,
  }: {
    pagination: PaginationParams;
    organizationId: string;
  }) {
    const queryBuilder = this.client
      .selectFrom('Invite')
      .where('organizationId', '=', organizationId)
      .selectAll();
    return paginate<Invite>({ queryBuilder, pagination, identifier: 'id' });
  }

  async fetchPendingInviteById(id: string) {
    return this.client
      .selectFrom('Invite')
      .selectAll()
      .where('id', '=', id)
      .where('status', '=', 'pending')
      .executeTakeFirst();
  }
  async updateInviteById({
    id,
    organizationId,
    payload,
  }: {
    id: string;
    organizationId: string;
    payload: UpdateInvitePayload;
  }) {
    return this.client
      .updateTable('Invite')
      .set({ ...payload })
      .where('id', '=', id)
      .where('organizationId', '=', organizationId)
      .where('status', '=', 'pending')
      .execute();
  }
}
