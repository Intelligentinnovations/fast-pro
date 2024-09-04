import { convertAndSendResponse } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  AddProcurementPayload,
  AddProcurementSchema,
  ApproveProcurementPayload,
  ApproveProcurementSchema,
  Permission,
  ProcurementFilters,
  ProcurementStatus,
  UserData,
} from '../utils';
import {
  AddProcurementDto,
  ApproveProcurementDto,
} from './dto/addProcurementDto';
import { ProcurementService } from './procurement.service';

@ApiTags('Procurement')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_PROCUREMENT)
  @ApiOperation({ summary: 'Create procurement' })
  @UsePipes(new ZodValidationPipe(AddProcurementSchema))
  @ApiBody({ type: AddProcurementDto })
  @ApiOkResponse({ description: `Procurement created successful` })
  @ApiBadRequestResponse({
    description: 'Please add items to cart to continue',
  })
  async createProcurement(
    @Body() payload: AddProcurementPayload,
    @Req() req: FastifyRequest
  ) {
    const { userId, organizationId } = req?.user as UserData;
    const data = await this.procurementService.createProcurement({
      ...payload,
      userId,
      organizationId: organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @RequiredPermission(Permission.VIEW_PROCUREMENT)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'filter by status',
    enum: ProcurementStatus,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by date',
    enum: ['created_at'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
  })
  @ApiOperation({ summary: 'Get all procurement' })
  @ApiOkResponse({ description: 'Procurement fetched successfully' })
  async fetchProcurements(
    @Req() req: FastifyRequest,
    @Query() searchQuery: ProcurementFilters
  ) {
    const organizationId = req.user?.organizationId as string;
    const data = await this.procurementService.fetchProcurements({
      organizationId,
      query: searchQuery,
    });
    return convertAndSendResponse(data);
  }

  @Get(':id')
  @RequiredPermission(Permission.VIEW_PROCUREMENT)
  @ApiOperation({ summary: 'Get procurement by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Procurement ID' })
  @ApiOkResponse({ description: 'Procurement fetched successfully' })
  @ApiNotFoundResponse({ description: 'Procurement not found' })
  async getProcurement(@Param('id') id: string, @Req() req: FastifyRequest) {
    const organizationId = req.user?.organizationId as string;
    const data = await this.procurementService.getProcurement({
      id,
      organizationId,
    });
    return convertAndSendResponse(data);
  }

  @Post(':id/approve')
  @RequiredPermission(Permission.UPDATE_PROCUREMENT)
  @ApiOperation({ summary: 'Approve procurement' })
  @ApiBody({ type: ApproveProcurementDto })
  @ApiParam({ name: 'id', required: true, description: 'Procurement ID' })
  @ApiOkResponse({ description: 'Procurement approved successfully' })
  @ApiNotFoundResponse({ description: 'Procurement not found' })
  async approveProcurement(
    @Req() req: FastifyRequest,
    @Body(new ZodValidationPipe(ApproveProcurementSchema))
    payload: ApproveProcurementPayload,
    @Param('id') id: string
  ) {
    const organizationId = req.user?.organizationId as string;
    const data = await this.procurementService.approveProcurement({
      id,
      organizationId,
      payload,
    });
    return convertAndSendResponse(data);
  }
}
