import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import {
  CreateInvitePayload,
  UpdateInvitePayload,
} from '../utils/schema/staff';
import { PaginationParams } from '../utils/types/paginationParams';

@Injectable()
export class InviteService {
  constructor(private inviteRepo: InviteRepo) {}
  async invite(
    payload: CreateInvitePayload & { organizationId: string }
  ): Promise<IServiceHelper> {
    const invite = await this.inviteRepo.createInvite(payload);
    return {
      status: 'created',
      message: `You have successfully sent an invite to ${payload.email}`,
      data: invite,
    };
  }

  async delete(payload: {
    organizationId: string;
    id: string;
  }): Promise<IServiceHelper> {
    const invite = await this.inviteRepo.fetchOrganizationInvite(payload);
    if (invite?.status === 'used')
      return {
        status: 'forbidden',
        message: 'The invite has already been used by a user',
      };
    await this.inviteRepo.deleteInvite(payload);
    return {
      status: 'deleted',
      message: 'Invite deleted successfully',
    };
  }

  async fetchInvites({
    organizationId,
    paginationData,
  }: {
    organizationId: string;
    paginationData: PaginationParams;
  }): Promise<IServiceHelper> {
    const invites = await this.inviteRepo.fetchInvites({
      pagination: paginationData,
      organizationId,
    });
    return {
      status: 'successful',
      message: 'Invited fetched successfully',
      data: invites,
    };
  }

  async updateInvite(
    payload: UpdateInvitePayload & { inviteId: string; organizationId: string }
  ): Promise<IServiceHelper> {
    const { inviteId, organizationId, ...data } = payload;
    await this.inviteRepo.updateInviteById({
      id: inviteId,
      organizationId,
      payload: data,
    });
    return {
      status: 'successful',
      message: 'Invite updated successfully',
    };
  }
}
