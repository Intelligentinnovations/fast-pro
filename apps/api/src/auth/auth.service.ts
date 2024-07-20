import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Cache } from "cache-manager";
import jwt from 'jsonwebtoken'
import { generateRandomNumber } from 'libs/helpers/src/lib/randomNumber';

import { UserRepo } from '../repository/user';
import { SecretsService } from '../secrets/secrets.service';
import { CreateAdminAccountPayload, LoginPayload, VerifyEmailPayload } from '../utils/schema/auth';
import { UserStatus } from '../utils/types';


@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepo,
    private secrets: SecretsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache

  ) { }
  async registerAdmin(payload: CreateAdminAccountPayload): Promise<IServiceHelper> {
    const userExist = await this.userRepo.getUserByEmail(payload.email)
    if (userExist) return {
      status: "conflict",
      message: "A user with the email exist"
    }
    const data = await this.userRepo.createOrganization(payload)
    const OTP_LENGTH = 6
    const otp = generateRandomNumber(OTP_LENGTH)
    console.log({otp});

    const cacheKey = `${data.email}-signup-verification`
    await this.cacheManager.set(cacheKey, otp)
    // send otp via email

    return {
      status: 'created',
      message: `We have sent a code to ${payload.email}`,
      data
    }
  }

  async verifyUser (payload: VerifyEmailPayload): Promise<IServiceHelper>  {
    const cacheKey = `${payload.email}-signup-verification`;
    const otp = await  this.cacheManager.get(cacheKey)
    if(!otp) return {
      status: 'bad-request',
      message: "Invalid Otp"
    }
    const updatedUser = await this.userRepo.updateUserByEmail({
      status: UserStatus.ACTIVE,
      email: payload.email
    })
    const token = jwt.sign(updatedUser, this.secrets.get('SECRET_KEY'), {
      expiresIn: 30000,
    });
    await this.cacheManager.del(cacheKey)
    return  {
      status: 'successful',
      message: 'Account verification successful',
      data: {...updatedUser, token}
    }
  }

  async login (payload: LoginPayload): Promise<IServiceHelper>  {
    const user = await this.userRepo.getUserWithRolesAndPermissions(payload.email)
    if(!user) return  {
      status: 'bad-request',
      message: `Invalid email or password`
    }
    if (user.status === 'UNVERIFIED') {
      const OTP_LENGTH = 6
      const otp = generateRandomNumber(OTP_LENGTH)
      console.log({otp});

      const cacheKey = `${payload.email}-signup-verification`
      await this.cacheManager.set(cacheKey, otp)
      return {
        status: 'successful',
        message: "An Otp has been sent to your email, please verify your account to continue"
      }
    }
    if(user.status === 'DEACTIVATED'){
      return {
        status: 'forbidden',
        message: 'Please contact administrator'
      }
    }
    const passwordMatch = await bcrypt.compare(payload.password, user.password)
    const cacheKey = `${payload.email}-login-retry`;
    const loginRetry = Number(await this.cacheManager.get(cacheKey)) || 1
    const MAX_RETRY = 5;
    if(!passwordMatch) {
      if(loginRetry >= MAX_RETRY) return  {
        status: 'forbidden',
        message: 'Your account has been locked out, please contact support'
      }
      await this.cacheManager.set(cacheKey, loginRetry + 1)
      return {
        status: 'bad-request',
        message: `Invalid email or password, you have ${MAX_RETRY - loginRetry} attempt left`
      }
    }
    if(loginRetry > 1) await this.cacheManager.del(cacheKey)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData} = user;
    const token = jwt.sign(userData, this.secrets.get('SECRET_KEY'), {
      expiresIn: 30000,
    });
  return {
    status: 'successful',
    message: "Login successful",
    data: {...userData, token}
  }
  }


}
