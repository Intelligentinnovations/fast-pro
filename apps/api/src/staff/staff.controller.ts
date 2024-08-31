import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import {
  AuthGuard,
  PermissionsGuard,
  RequiredPermission,
} from '../libraries/guards';
import {
  CreateStaffAccountPayload,
  CreateStaffAccountSchema,
  Permission,
  QueryParams,
} from '../utils';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('register')
  @ApiOperation({ summary: 'Staff Signup.' })
  @ApiBody({
    description: 'Staff Registration data',
    schema: zodToApi(CreateStaffAccountSchema),
  })
  @ApiCreatedResponse({ description: `Account created successful` })
  @ApiConflictResponse({
    description: 'An account exist with this email, please login',
  })
  @UsePipes(new ZodValidationPipe(CreateStaffAccountSchema))
  async staffRegistration(@Body() payload: CreateStaffAccountPayload) {
    const data = await this.staffService.registerStaff(payload);
    return convertAndSendResponse(data);
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequiredPermission(Permission.VIEW_STAFF)
  @ApiOperation({ summary: 'Fetch all staff' })
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
  @ApiOkResponse({ description: 'Staff fetched successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  async getStaff(
    @Request() req: FastifyRequest,
    @Query() paginationData: QueryParams
  ) {
    const data = await this.staffService.fetchStaff({
      organizationId: req.user?.organizationId as string,
      paginationData,
      currentUserId: req.user?.userId as string,
    });
    return convertAndSendResponse(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequiredPermission(Permission.DELETE_STAFF)
  @ApiOperation({ summary: 'Delete a staff' })
  @ApiOkResponse({ description: 'staff deleted successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  async delete(@Param('id') id: string, @Request() req: FastifyRequest) {
    const data = await this.staffService.delete({
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }
}
