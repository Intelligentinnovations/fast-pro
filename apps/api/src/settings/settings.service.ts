import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserRepo } from '../repository';
import { ChangePasswordPayload } from '../utils';

@Injectable()
export class SettingsService {
  constructor(private userRepo: UserRepo) {}

  async changePassword(
    payload: ChangePasswordPayload & { email: string }
  ): Promise<IServiceHelper> {
    const { email, newPassword, currentPassword } = payload;
    const user = await this.userRepo.getUserByEmail(email);

    const match = bcrypt.compare(currentPassword, user?.password as string);
    if (!match)
      return {
        status: 'forbidden',
        message: 'Incorrect password',
      };
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updateUserByEmail({
      email: payload.email,
      payload: { password: hashedPassword },
    });

    return {
      status: 'successful',
      message: 'Password updated successfully',
    };
  }

  async deleteOrganizationAccount({
    organizationId,
    password,
    email,
  }: {
    organizationId: string;
    password: string;
    email: string;
  }): Promise<IServiceHelper> {
    const user = await this.userRepo.getUserByEmail(email);
    const match = bcrypt.compare(password, user?.password as string);
    if (!match)
      return {
        status: 'forbidden',
        message: 'Incorrect password',
      };
    await this.userRepo.deleteOrganization(organizationId);
    return {
      status: 'successful',
      message: 'account deleted successfully',
    };
  }
}
