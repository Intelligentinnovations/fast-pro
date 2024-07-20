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
  CreateAdminAccountSchema, LoginPayload, LoginSchema,
  VerifyEmailPayload,
  VerifyEmailSchema
} from '../utils/schema/auth';
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

  @Post("verify-email")
  @ApiOperation({summary: 'Verify email on signup.'})
  @ApiBody({ schema: zodToApi(VerifyEmailSchema)})
  @ApiOkResponse({description: `Account verification successful`})
  @ApiBadRequestResponse({description: 'Invalid Otp'})
  @UsePipes(new ZodValidationPipe(VerifyEmailSchema))
  async verifyEmail(@Body() payload: VerifyEmailPayload) {
    const data = await this.authService.verifyUser(payload)
    return convertAndSendResponse(data)
  }

  @Post("login")
  @ApiOperation({summary: 'User Login.'})
  @ApiBody({ schema: zodToApi(LoginSchema)})
  @ApiOkResponse({description: 'Login successful'})
  @ApiOkResponse({description: 'An Otp has been sent to your email, please verify your account to continue'})
  @ApiForbiddenResponse({description: 'Your account has been locked out, please contact support'})
  @ApiBadRequestResponse({description: 'Invalid email or password'})
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() payload: LoginPayload) {
    const data = await this.authService.login(payload)
    return convertAndSendResponse(data)
  }
}
