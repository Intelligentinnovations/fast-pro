import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { InviteRepo, UserRepo } from '../repository';
import { SecretsService } from '../secrets/secrets.service';
import { CreateStaffAccountPayload, PaginationParams } from '../utils';

@Injectable()
export class StaffService {
  constructor(
    private userRepo: UserRepo,
    private inviteRepo: InviteRepo,
    private secrets: SecretsService
  ) {}

  async registerStaff(
    payload: CreateStaffAccountPayload
  ): Promise<IServiceHelper> {
    const invite = await this.inviteRepo.fetchPendingInviteById(
      payload.inviteId
    );
    if (!invite)
      return {
        status: 'not-found',
        message: 'Invite not found',
      };

    const userExist = await this.userRepo.getUserByEmail(invite.email);
    if (userExist)
      return {
        status: 'conflict',
        message: 'An account exist with this email, please login',
      };
    const { email, departmentId, roleId, organizationId } = invite;
    await this.userRepo.createStaff({
      ...payload,
      organizationId,
      email,
      departmentId,
      roleId,
      hashedPassword: await bcrypt.hash(payload.password, 10),
    });

    const user = await this.userRepo.getUserAndPermissions(invite.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    const token = jwt.sign(userData, this.secrets.get('SECRET_KEY'), {
      expiresIn: 30000,
    });
    await this.inviteRepo.updateInviteById({
      id: payload.inviteId,
      organizationId,
      payload: { status: 'used' },
    });

    return {
      status: 'created',
      message: 'Account created successful',
      data: { ...userData, permissions: undefined, token },
    };
  }

  async fetchStaff({
    organizationId,
    paginationData,
    currentUserId,
  }: {
    organizationId: string;
    paginationData: PaginationParams;
    currentUserId: string;
  }): Promise<IServiceHelper> {
    const staff = await this.userRepo.fetchOrganizationUsers({
      pagination: paginationData,
      organizationId,
      currentUserId,
    });
    return {
      status: 'successful',
      message: 'Staff fetched successfully',
      data: staff,
    };
  }

  async delete({
    organizationId,
    id,
  }: {
    organizationId: string;
    id: string;
  }): Promise<IServiceHelper> {
    await this.userRepo.deleteUser({ organizationId, userId: id });
    return {
      status: 'deleted',
      message: 'Staff deleted successfully',
    };
  }
}
