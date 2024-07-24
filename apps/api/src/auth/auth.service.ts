import { IServiceHelper } from '@backend-template/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Cache } from "cache-manager";
import jwt from 'jsonwebtoken'
import { generateRandomNumber } from 'libs/helpers/src/lib/randomNumber';

import { InviteRepo } from '../repository/invite';
import { UserRepo } from '../repository/user';
import { SecretsService } from '../secrets/secrets.service';
import {
  CreateAdminAccountPayload,
  CreateStaffAccountPayload,
EmailPayload,
  LoginPayload, ResetPasswordPayload,
  VerifyOtpPayload} from '../utils/schema/auth';
import { UserStatus } from '../utils/types';


@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepo,
    private inviteRepo: InviteRepo,
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
    await this.cacheManager.set(`${payload.email}-pending-otp`, cacheKey)
    await this.cacheManager.set(cacheKey, otp)
    // send otp via email

    return {
      status: 'created',
      message: `We have sent a code to ${payload.email}`,
      data
    }
  }


  async login (payload: LoginPayload): Promise<IServiceHelper>  {
    const user = await this.userRepo.getUserAndPermissions(payload.email)
    if(!user) return  {
      status: 'bad-request',
      message: `Invalid email or password`
    }
    if (user.status === 'UNVERIFIED') {
      const OTP_LENGTH = 6
      const otp = generateRandomNumber(OTP_LENGTH)
      const cacheKey = `${payload.email}-signup-verification`

      await this.cacheManager.set(`${user.email}-pending-otp`, cacheKey)
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
        message: 'Your have been locked out, please contact support'
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
    data: {...userData, permissions: undefined, token}
  }
  }

  async registerStaff(payload: CreateStaffAccountPayload): Promise<IServiceHelper> {
    const invite = await this.inviteRepo.fetchPendingInviteById(payload.inviteId);
    if(!invite) return {
      status: 'not-found',
      message: 'Invite not found'
    }

    const userExist = await this.userRepo.getUserByEmail(invite.email)
    if (userExist) return {
      status: "conflict",
      message: "An account exist with this email, please login"
    }
    const {email, departmentId, roleId, organizationId} = invite;
    await this.userRepo.createStaff({
      ...payload,
      organizationId,
      email,
      departmentId,
      roleId,
      hashedPassword: await bcrypt.hash(payload.password, 10)
    })

    const user = await this.userRepo.getUserAndPermissions(invite.email)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userData} = user

    const token = jwt.sign(userData, this.secrets.get('SECRET_KEY'), {
      expiresIn: 30000,
    });
    await this.inviteRepo.updateInviteById({
      id:payload.inviteId,
      organizationId,
      payload: {status: 'USED'}
    })

    return {
      status: 'created',
      message: "Account created successful",
      data: {...userData, permissions: undefined, token}
    }
  }

  async requestPasswordReset ({email}: EmailPayload): Promise<IServiceHelper> {
    const user = await this.userRepo.getUserByEmail(email)
    if(user) {
      const OTP_LENGTH = 6
      const otp = generateRandomNumber(OTP_LENGTH)
      const cacheKey = `${user.email}-password-reset`

      await this.cacheManager.set(`${user.email}-pending-otp`, cacheKey)
      await this.cacheManager.set(cacheKey, otp)

      console.log({otp});
      // Todo send email
    }
    return {
      status: 'successful',
      message: 'If you have an account, An Otp has been sent to your email.'
    }
  }


  async validateOtp (payload: VerifyOtpPayload): Promise<IServiceHelper>  {
    const pendingOtpKey = `${payload.email}-pending-otp`;

    if(!pendingOtpKey) return  {
      status: 'bad-request',
      message: "Invalid Otp"
    }
    const originalOtpKey = await this.cacheManager.get<string>(pendingOtpKey) as string
    const originalOpt = await this.cacheManager.get<string>(originalOtpKey)

    if(!originalOpt || originalOpt !== payload.otp) return {
      status: 'bad-request',
      message: "Invalid Otp"
    }

    await this.cacheManager.del(pendingOtpKey)
    await this.cacheManager.del(originalOtpKey)

    if(originalOtpKey === `${payload.email}-signup-verification`){
      await this.userRepo.updateUserByEmail({
        status: UserStatus.ACTIVE,
        email: payload.email
      })

      const updatedUser = await this.userRepo.getUserAndPermissions(payload.email);
      const token = jwt.sign(updatedUser, this.secrets.get('SECRET_KEY'), {
        expiresIn: 30000,
      });

      return  {
        status: 'successful',
        message: 'Account verification successful',
        data: {...updatedUser, password: undefined, token}
      }
    }
    const verifiedActionKey = `${payload.email}-verified-action-otp`;
    await this.cacheManager.set(verifiedActionKey, originalOtpKey)
    return  {
      status: 'successful',
      message: 'Otp verified successfully',
    }
  }

  async resetPassword (payload: ResetPasswordPayload): Promise<IServiceHelper> {
    const {email, password} = payload;
    const verifiedActionKey = `${email}-verified-action-otp`
    const verifiedAction = await this.cacheManager.get(verifiedActionKey);

    if(!verifiedAction || verifiedAction !== `${email}-password-reset`) return {
      status: 'forbidden',
      message: 'Please verify otp to continue'
    }
    await this.userRepo.updateUserByEmail({
      email,
      password: await bcrypt.hash(password, 10)
    });

    return  {
      status: 'successful',
      message: 'Password reset successful'
    }
  }

  async resendOtp ({email}: EmailPayload): Promise<IServiceHelper> {
    const pendingOtpKey = `${email}-pending-otp`;
    const originalOtpKey = await this.cacheManager.get<string>(pendingOtpKey) as string

    if(!originalOtpKey) return {
      status: 'bad-request',
      message: 'No pending otp',
    }

    const OTP_LENGTH = 6
    const otp = generateRandomNumber(OTP_LENGTH)
    await this.cacheManager.set(originalOtpKey, otp)

    return {
      status: 'successful',
      message: 'Otp sent successfully'
    }
  }



}
