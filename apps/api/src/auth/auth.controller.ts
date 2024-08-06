import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  EmailPayload,
  EmailSchema,
  LoginPayload,
  LoginSchema,
  ResetPasswordPayload,
  ResetPasswordSchema,
  VerifyOtpPayload,
  VerifyOtpSchema,
} from '../utils';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate a otp generated on the system' })
  @ApiBody({ schema: zodToApi(VerifyOtpSchema) })
  @ApiOkResponse({ description: `Otp verified successful` })
  @ApiBadRequestResponse({ description: 'Invalid Otp' })
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  async validateOtp(@Body() payload: VerifyOtpPayload) {
    const data = await this.authService.validateOtp(payload);
    return convertAndSendResponse(data);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend Otp' })
  @ApiBody({ schema: zodToApi(EmailSchema) })
  @ApiOkResponse({ description: `Otp sent successful` })
  @ApiBadRequestResponse({ description: 'No pending otp' })
  @UsePipes(new ZodValidationPipe(EmailSchema))
  async resendOtp(@Body() payload: VerifyOtpPayload) {
    const data = await this.authService.resendOtp(payload);
    return convertAndSendResponse(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login.' })
  @ApiBody({ schema: zodToApi(LoginSchema) })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiForbiddenResponse({
    description: 'Your have been locked out, please contact support',
  })
  @ApiBadRequestResponse({ description: 'Invalid email or password' })
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() payload: LoginPayload) {
    const data = await this.authService.login(payload);
    return convertAndSendResponse(data);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ schema: zodToApi(EmailSchema) })
  @ApiOkResponse({
    description: 'An Otp has been sent to your email, if you have an account',
  })
  @ApiBadRequestResponse({ description: 'Email is required' })
  @UsePipes(new ZodValidationPipe(EmailSchema))
  async requestPasswordReset(@Body() payload: EmailPayload) {
    const data = await this.authService.requestPasswordReset(payload);
    return convertAndSendResponse(data);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Password reset' })
  @ApiBody({ schema: zodToApi(ResetPasswordSchema) })
  @ApiOkResponse({ description: 'Password reset successful' })
  @ApiBadRequestResponse({ description: 'Email is required' })
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  async resetPassword(@Body() payload: ResetPasswordPayload) {
    const data = await this.authService.resetPassword(payload);
    return convertAndSendResponse(data);
  }
}
