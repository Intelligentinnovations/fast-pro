import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserRepo } from '../repository';
import { SecretsService } from '../secrets/secrets.service';
import { ChangePasswordPayload } from '../utils';

@Injectable()
export class SettingsService {
  constructor(private userRepo: UserRepo, private secrets: SecretsService) {}

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
      password: hashedPassword,
    });

    return {
      status: 'successful',
      message: 'Password updated successfully',
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
