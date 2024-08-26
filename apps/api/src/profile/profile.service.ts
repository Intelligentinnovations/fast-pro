import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { undefined } from 'zod';

import { OrganizationRepo, UserRepo } from '../repository';
import {
  UpdateCompanyProfilePayload,
  UpdateUserProfilePayload,
} from '../utils';

@Injectable()
export class ProfileService {
  constructor(
    private userRepo: UserRepo,
    private organizationRepo: OrganizationRepo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async fetchUserProfile(userId: string): Promise<IServiceHelper> {
    const userProfile = await this.userRepo.getUserProfile(userId);
    if (!userProfile)
      return {
        status: 'not-found',
        message: 'User profile does not exist',
      };
    const {
      organizationId,
      organizationName,
      organizationPhoneNumber,
      organizationAddress,
      organizationLogo,
      organizationEmail,
      organizationWebsiteUrl,
      organizationDescription,
      ...userInfo
    } = userProfile;
    const organization = organizationId
      ? {
          organizationId,
          organizationName,
          organizationPhoneNumber,
          organizationAddress,
          organizationLogo,
          organizationEmail,
          organizationWebsiteUrl,
          organizationDescription,
        }
      : undefined;

    return {
      status: 'successful',
      message: 'User profile fetched successfully',
      data: { ...userInfo, organization },
    };
  }

  async updateUser({
    email,
    payload,
  }: {
    email: string;
    payload: UpdateUserProfilePayload;
  }): Promise<IServiceHelper> {
    await this.userRepo.updateUserByEmail({ email, payload });

    return {
      status: 'successful',
      message: 'Profile updated successfully',
    };
  }
  async updateOrganization({
    organizationId,
    payload,
  }: {
    organizationId: string;
    payload: UpdateCompanyProfilePayload;
  }): Promise<IServiceHelper> {
    await this.organizationRepo.updateOrganization({ organizationId, payload });
    return {
      status: 'successful',
      message: 'Profile updated successfully',
    };
  }
}
