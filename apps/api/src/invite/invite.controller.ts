import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard } from '../libraries/guards/auth.guards';
import { PermissionsGuard } from '../libraries/guards/permissions-guard.service';
import { RequiredPermission } from '../libraries/guards/role.decorator';
import { PaginationParams, Permission } from '../utils';
import {
  CreateInvitePayload,
  CreateInviteSchema,
  UpdateInvitePayload,
  UpdateInviteSchema,
} from '../utils/schema/staff';
import { InviteService } from './invite.service';

@ApiTags('Invites')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('invites')
export class InviteController {
  constructor(private readonly staffService: InviteService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_INVITE)
  @ApiOperation({ summary: 'Invite staff member' })
  @ApiBody({
    description: 'Invite staff to join fast organization',
    schema: zodToApi(CreateInviteSchema),
  })
  @ApiCreatedResponse({ description: `We have sent an invite to staff email` })
  @ApiConflictResponse({ description: 'A staff with the email exist' })
  @UsePipes(new ZodValidationPipe(CreateInviteSchema))
  async invite(
    @Body() payload: CreateInvitePayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.staffService.invite({
      ...payload,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }
  @Put('/:id')
  @RequiredPermission(Permission.UPDATE_INVITE)
  @ApiOperation({ summary: 'Update staff invite' })
  @ApiBody({
    description: 'Update invite payload',
    schema: zodToApi(UpdateInviteSchema),
  })
  @ApiOkResponse({ description: 'Invite updated successfully' })
  @UsePipes(new ZodValidationPipe(UpdateInviteSchema))
  async updateInvite(
    @Body() payload: UpdateInvitePayload,
    @Param('id') inviteId: string,
    @Request() req: FastifyRequest
  ) {
    const data = await this.staffService.updateInvite({
      ...payload,
      inviteId,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Delete('/:id')
  @RequiredPermission(Permission.DELETE_INVITE)
  @ApiOperation({ summary: 'Delete invite' })
  @ApiOkResponse({ description: 'Invite deleted successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  @ApiNotFoundResponse({ description: 'Invite not found' })
  async delete(@Param('id') id: string, @Request() req: FastifyRequest) {
    const data = await this.staffService.delete({
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @RequiredPermission(Permission.VIEW_INVITE)
  @ApiOperation({ summary: 'Fetch all organization invites' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOkResponse({ description: 'Invites fetched successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  async getStaff(
    @Request() req: FastifyRequest,
    @Query() paginationData: PaginationParams
  ) {
    const data = await this.staffService.fetchInvites({
      organizationId: req.user?.organizationId as string,
      paginationData,
    });
    return convertAndSendResponse(data);
  }
}
