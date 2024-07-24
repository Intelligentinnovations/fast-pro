import { convertAndSendResponse } from '@backend-template/helpers';
import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation, ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard } from '../libraries/guards/auth.guards';
import { PermissionsGuard } from '../libraries/guards/permissions-guard.service';
import {RequiredPermission} from '../libraries/guards/role.decorator'
import { PaginationParams } from '../utils/types/paginationParams';
import { Permission } from '../utils/types/permission'
import { StaffService } from './staff.service';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}


  @Get("")
  @RequiredPermission(Permission.VIEW_STAFF)
  @ApiOperation({summary: 'Fetch all staff'})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiOkResponse({description: 'Staff fetched successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  async getStaff(@Request() req: FastifyRequest, @Query() paginationData: PaginationParams) {
    const data = await this.staffService.fetchStaff({
      organizationId: req.user?.organizationId as string,
      paginationData
    })
    return convertAndSendResponse(data)
  }

  @Delete(":id")
  @RequiredPermission(Permission.DELETE_STAFF)
  @ApiOperation({summary: 'Delete a staff'})
  @ApiOkResponse({description: 'staff deleted successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  async delete( @Param('id') id: string, @Request() req: FastifyRequest) {
    const data = await this.staffService.delete({
      id,
      organizationId: req.user?.organizationId as string
    })
    return convertAndSendResponse(data)
  }
}
