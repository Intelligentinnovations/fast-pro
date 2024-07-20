import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Cache } from "cache-manager";
import jwt from 'jsonwebtoken'
import { generateRandomNumber } from 'libs/helpers/src/lib/randomNumber';

import { UserRepo } from '../repository/user';
import { SecretsService } from '../secrets/secrets.service';
import {  LoginPayload, VerifyEmailPayload } from '../utils/schema/auth';
import { UserStatus } from '../utils/types';
import { CreateInvitePayload, StaffRegistrationPayload, StaffRegistrationSchema } from '../utils/schema/staff';


@Injectable()
export class StaffService {
  constructor(
    private userRepo: UserRepo,
    private secrets: SecretsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache

  ) { }
  async invite(payload: CreateInvitePayload): Promise<IServiceHelper> {
    return {
      status: 'created',
      message: `You have successfully sent an invite to ${payload.email}`,

    }
  }

  async register (payload: StaffRegistrationPayload): Promise<IServiceHelper>  {
    return  {
      status: 'successful',
      message: 'Account created successful',
    }
  }

  async delete (staffId: string): Promise<IServiceHelper>  {
  return {
    status: 'deleted',
    message: "Staff deleted successfully"
  }
  }
  async fetchStaff (): Promise<IServiceHelper>  {
  return {
    status: 'deleted',
    message: "Staff deleted successfully"
  }
  }


}
