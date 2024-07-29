import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { generateRandomNumber } from 'libs/helpers/src/lib/randomNumber';

import { OrganizationRepo, UserRepo, VendorRepo } from '../repository';
import {
  CompleteAdminRegistrationPayload,
  CompleteVendorRegistrationPayload,
  CreateAdminAccountPayload,
  CreateVendorPayload,
} from '../utils/schema/user';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private vendorRepo: VendorRepo,
    private organizationRepo: OrganizationRepo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async registerAdmin(
    payload: CreateAdminAccountPayload
  ): Promise<IServiceHelper> {
    const userExist = await this.userRepo.getUserByEmail(payload.email);
    if (userExist)
      return {
        status: 'conflict',
        message: 'A user with the email exist',
      };
    const data = await this.userRepo.createOrganization(payload);
    const OTP_LENGTH = 6;
    const otp = generateRandomNumber(OTP_LENGTH);
    console.log({ otp });

    const cacheKey = `${data.email}-signup-verification`;
    await this.cacheManager.set(`${payload.email}-pending-otp`, cacheKey);
    await this.cacheManager.set(cacheKey, otp);
    // Todo send otp via email
    return {
      status: 'created',
      message: `We have sent a code to ${payload.email}`,
      data,
    };
  }

  async registerVendor(payload: CreateVendorPayload): Promise<IServiceHelper> {
    const { email } = payload;
    const user = await this.userRepo.getUserByEmail(email);
    if (user)
      return {
        status: 'forbidden',
        message: 'A account with the email exist, please login',
      };

    const vendor = await this.userRepo.createVendor(payload);
    const OTP_LENGTH = 6;
    const otp = generateRandomNumber(OTP_LENGTH);
    console.log({ otp });

    const cacheKey = `${payload.email}-signup-verification`;
    await this.cacheManager.set(`${payload.email}-pending-otp`, cacheKey);
    await this.cacheManager.set(cacheKey, otp);

    return {
      status: 'created',
      message: `We have sent a code to ${payload.email}, please verify to continue`,
      data: vendor,
    };
  }

  async completeVendorRegistration(
    payload: CompleteVendorRegistrationPayload & { vendorId: string }
  ): Promise<IServiceHelper> {
    const { vendorId, ...updatePayload } = payload;
    await this.vendorRepo.updateVendor({
      vendorId,
      payload: { ...updatePayload, status: 'ACTIVE' },
    });
    return {
      status: 'successful',
      message: 'Registration completed successfully',
    };
  }

  async completeAdminRegistration(
    payload: CompleteAdminRegistrationPayload & { organizationId: string }
  ): Promise<IServiceHelper> {
    const { organizationId, ...updatePayload } = payload;
    await this.organizationRepo.updateOrganization({
      organizationId,
      payload: updatePayload,
    });
    return {
      status: 'successful',
      message: 'Registration completed successfully',
    };
  }
}
