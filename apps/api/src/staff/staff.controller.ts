import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import {  ZodValidationPipe } from '@backend-template/http';
import { Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard } from '../libraries/guards/auth.guards';
import {RequiredPermission} from '../libraries/guards/role.decorator'
import { RolesGuard } from '../libraries/guards/roles.guard';
import {
  CreateInvitePayload,
  CreateInviteSchema,
} from '../utils/schema/staff';
import { PaginationParams } from '../utils/types/paginationParams';
import { Permission } from '../utils/types/permission'
import { StaffService } from './staff.service';

@ApiTags('Invite')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('invite')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_INVITE)
  @ApiOperation({summary: 'Invite staff member'})
  @ApiBody({description: 'Admin Registration', schema: zodToApi(CreateInviteSchema)})
  @ApiCreatedResponse({description: `We have sent an invite to staff email`})
  @ApiConflictResponse({description: 'A staff with the email exist'})
  @UsePipes(new ZodValidationPipe(CreateInviteSchema))
  async invite(@Body() payload: CreateInvitePayload, @Request() req: FastifyRequest) {
    const data = await this.staffService.invite({
      ...payload,
      organizationId: req.user?.organizationId as string
    })
    return convertAndSendResponse(data)

  }

  @Delete("delete/:id")
  @RequiredPermission(Permission.DELETE_INVITE)
  @ApiOperation({summary: 'Delete invite'})
  @ApiOkResponse({description: 'Invite deleted successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  @ApiNotFoundResponse({description: 'Invite not found'})
  async delete( @Param('id') id: string, @Request() req: FastifyRequest) {
    const data = await this.staffService.delete({
      id,
      organizationId: req.user?.organizationId as string
    })
    return convertAndSendResponse(data)
  }

  @Get("")
  @RequiredPermission(Permission.VIEW_INVITE)
  @ApiOperation({summary: 'Fetch all organization invites'})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiOkResponse({description: 'Invites fetched successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  async getStaff(@Request() req: FastifyRequest, @Query() paginationData: PaginationParams) {
    const data = await this.staffService.fetchStaff({
      organizationId: req.user?.organizationId as string,
      paginationData
    })
    return convertAndSendResponse(data)
  }
}
