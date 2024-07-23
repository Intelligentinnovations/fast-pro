import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import {  ZodValidationPipe } from '@backend-template/http';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody, ApiConflictResponse,
  ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import {
  CreateAdminAccountPayload,
  CreateAdminAccountSchema,
  CreateStaffAccountPayload,
  CreateStaffAccountSchema,
  EmailPayload, EmailSchema,
  LoginPayload,
  LoginSchema,
ResetPasswordPayload,
ResetPasswordSchema,   VerifyOtpPayload,
  VerifyOtpSchema} from '../utils/schema/auth';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin-register')
  @ApiOperation({summary: 'Admin/organization Signup.'})
  @ApiBody({description: 'Admin Registration', schema: zodToApi(CreateAdminAccountSchema)})
  @ApiCreatedResponse({description: `We have sent a code to your email`})
  @ApiConflictResponse({description: 'A user with the email exist'})
  @UsePipes(new ZodValidationPipe(CreateAdminAccountSchema))
  async adminRegistration(@Body() payload: CreateAdminAccountPayload) {
    const data = await this.authService.registerAdmin(payload)
    return convertAndSendResponse(data)

  }

  @Post('staff-register')
  @ApiOperation({summary: 'Staff Signup.'})
  @ApiBody({description: 'Staff Registration data', schema: zodToApi(CreateStaffAccountSchema)})
  @ApiCreatedResponse({description: `Account created successful`})
  @ApiConflictResponse({description: 'An account exist with this email, please login'})
  @UsePipes(new ZodValidationPipe(CreateStaffAccountSchema))
  async staffRegistration(@Body() payload: CreateStaffAccountPayload) {
    const data = await this.authService.registerStaff(payload)
    return convertAndSendResponse(data)

  }


  @Post("validate-otp")
  @ApiOperation({summary: 'Validate a otp generated on the system'})
  @ApiBody({ schema: zodToApi(VerifyOtpSchema)})
  @ApiOkResponse({description: `Otp verified successful`})
  @ApiBadRequestResponse({description: 'Invalid Otp'})
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  async validateOtp(@Body() payload: VerifyOtpPayload) {
    const data = await this.authService.validateOtp(payload)
    return convertAndSendResponse(data)
  }

  @Post("login")
  @ApiOperation({summary: 'User Login.'})
  @ApiBody({ schema: zodToApi(LoginSchema)})
  @ApiOkResponse({description: 'Login successful'})
  @ApiForbiddenResponse({description: 'Your have been locked out, please contact support'})
  @ApiBadRequestResponse({description: 'Invalid email or password'})
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() payload: LoginPayload) {
    const data = await this.authService.login(payload)
    return convertAndSendResponse(data)
  }

  @Post("request-password-reset")
  @ApiOperation({summary: 'Request password reset'})
  @ApiBody({ schema: zodToApi(EmailSchema)})
  @ApiOkResponse({description: 'An Otp has been sent to your email, if you have an account'})
  @ApiBadRequestResponse({description: 'Email is required'})
  @UsePipes(new ZodValidationPipe(EmailSchema))
  async requestPasswordReset(@Body() payload: EmailPayload) {
    const data = await this.authService.requestPasswordReset(payload)
    return convertAndSendResponse(data)
  }

  @Post("reset-password")
  @ApiOperation({summary: 'Password reset'})
  @ApiBody({ schema: zodToApi(ResetPasswordSchema)})
  @ApiOkResponse({description: 'Password reset successful'})
  @ApiBadRequestResponse({description: 'Email is required'})
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  async resetPassword(@Body() payload: ResetPasswordPayload) {
    const data = await this.authService.resetPassword(payload)
    return convertAndSendResponse(data)
  }
}
