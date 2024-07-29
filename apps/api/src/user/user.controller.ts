import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import {
  AuthGuard,
  PermissionsGuard,
  RequiredPermission,
} from '../libraries/guards';
import { Permission } from '../utils';
import {
  CompleteAdminRegistrationPayload,
  CompleteAdminRegistrationSchema,
  CompleteVendorRegistrationPayload,
  CompleteVendorRegistrationSchema,
  CreateAdminAccountPayload,
  CreateAdminAccountSchema,
  CreateVendorPayload,
  CreateVendorSchema,
} from '../utils/schema/user';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('admin-register')
  @ApiOperation({ summary: 'Admin/organization Signup.' })
  @ApiBody({
    description: 'Admin Registration',
    schema: zodToApi(CreateAdminAccountSchema),
  })
  @ApiCreatedResponse({ description: `We have sent a code to your email` })
  @ApiConflictResponse({ description: 'A user with the email exist' })
  @UsePipes(new ZodValidationPipe(CreateAdminAccountSchema))
  async adminRegistration(@Body() payload: CreateAdminAccountPayload) {
    const data = await this.userService.registerAdmin(payload);
    return convertAndSendResponse(data);
  }

  @Post('complete-admin-register')
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequiredPermission(Permission.UPDATE_ORGANIZATION_PROFILE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete admin vendor registration.' })
  @ApiBody({
    description: ' Complete admin registration payload',
    schema: zodToApi(CompleteAdminRegistrationSchema),
  })
  @ApiOkResponse({ description: `Registration completed successfully` })
  @UsePipes(new ZodValidationPipe(CompleteAdminRegistrationSchema))
  async completeAdminRegistration(
    @Body() payload: CompleteAdminRegistrationPayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.userService.completeAdminRegistration({
      ...payload,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Post('vendor-register')
  @ApiOperation({ summary: 'Vendor registration.' })
  @ApiBody({
    description: 'Vendor Registration',
    schema: zodToApi(CreateVendorSchema),
  })
  @ApiCreatedResponse({ description: `We have sent a code to your email` })
  @ApiConflictResponse({ description: 'A user with the email exist' })
  @UsePipes(new ZodValidationPipe(CreateVendorSchema))
  async vendorRegistration(@Body() payload: CreateVendorPayload) {
    const data = await this.userService.registerVendor(payload);
    return convertAndSendResponse(data);
  }

  @Post('complete-vendor-register')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete vendor registration.' })
  @ApiBody({
    description: ' Complete vendor Registration',
    schema: zodToApi(CompleteVendorRegistrationSchema),
  })
  @ApiOkResponse({ description: `Registration completed successfully` })
  @UsePipes(new ZodValidationPipe(CompleteVendorRegistrationSchema))
  async completeVendorRegistration(
    @Body() payload: CompleteVendorRegistrationPayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.userService.completeVendorRegistration({
      ...payload,
      vendorId: req.user?.vendorId as string,
    });
    return convertAndSendResponse(data);
  }
}
