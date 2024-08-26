import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard, RequiredPermission } from '../libraries/guards';
import {
  Permission,
  UpdateCompanyProfilePayload,
  UpdateCompanyProfileSchema,
  UpdateUserProfilePayload,
  UpdateUserProfileSchema,
} from '../utils';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: `User profile fetched successfully` })
  @ApiOperation({ summary: 'Fetch user profile' })
  async getProfile(@Request() req: FastifyRequest) {
    const data = await this.profileService.fetchUserProfile(
      req.user?.userId as string
    );
    return convertAndSendResponse(data);
  }

  @Put('')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile.' })
  @ApiBody({
    description: 'Update profile payload',
    schema: zodToApi(UpdateUserProfileSchema),
  })
  @ApiOkResponse({ description: `Profile updated successfully` })
  @UsePipes(new ZodValidationPipe(UpdateUserProfileSchema))
  async updateUserProfile(
    @Body() payload: UpdateUserProfilePayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.profileService.updateUser({
      payload,
      email: req.user?.email as string,
    });
    return convertAndSendResponse(data);
  }

  @Put('organization')
  @UseGuards(AuthGuard)
  @RequiredPermission(Permission.UPDATE_ORGANIZATION_PROFILE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Organization profile.' })
  @ApiBody({
    description: 'Update Organization profile payload',
    schema: zodToApi(UpdateCompanyProfileSchema),
  })
  @ApiOkResponse({ description: `Registration completed successfully` })
  @UsePipes(new ZodValidationPipe(UpdateCompanyProfileSchema))
  async updateOrganizationProfile(
    @Body() payload: UpdateCompanyProfilePayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.profileService.updateOrganization({
      payload,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }
}
