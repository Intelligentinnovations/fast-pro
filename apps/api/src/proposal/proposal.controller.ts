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
  ApiCreatedResponse,
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
  CreateProposalPayload,
  CreateProposalSchema,
  PaginationParams,
  Permission,
  UpdateProposalPayload,
  UpdateProposalSchema,
} from '../utils';
import { ProposalService } from './proposal.service';

@ApiTags('Proposal')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalServices: ProposalService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_PROPOSAL)
  @ApiOperation({ summary: 'Create proposal' })
  @ApiBody({
    description: 'Proposal payload',
    schema: zodToApi(CreateProposalSchema),
  })
  @ApiCreatedResponse({ description: 'Proposal created successfully' })
  @UsePipes(new ZodValidationPipe(CreateProposalSchema))
  async createProposal(
    @Body() payload: CreateProposalPayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.proposalServices.createProposal({
      ...payload,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Put(':id')
  @RequiredPermission(Permission.UPDATE_PROPOSAL)
  @ApiOperation({ summary: 'Update proposal' })
  @ApiBody({
    description: 'Update Proposal payload',
    schema: zodToApi(UpdateProposalSchema),
  })
  @ApiCreatedResponse({ description: 'Proposal updated successfully' })
  @UsePipes(new ZodValidationPipe(UpdateProposalSchema))
  async updateProposal(
    @Body() payload: UpdateProposalPayload,
    @Request() req: FastifyRequest,
    @Param('id') id: string
  ) {
    const data = await this.proposalServices.updateProposal({
      payload,
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Get(':id')
  @RequiredPermission(Permission.VIEW_PROPOSAL)
  @ApiOperation({ summary: 'Fetch proposal details' })
  @ApiOkResponse({ description: 'Proposal fetched successfully' })
  async fetchProposal(@Param('id') proposalId: string) {
    const data = await this.proposalServices.fetchProposal(proposalId);
    return convertAndSendResponse(data);
  }

  @Get('organization')
  @RequiredPermission(Permission.VIEW_PROPOSAL)
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'Fetch organization proposals' })
  @ApiOkResponse({ description: 'Proposals fetched successfully' })
  async fetchOrganizationProposals(
    @Request() req: FastifyRequest,
    @Query() pagination: PaginationParams
  ) {
    const data = await this.proposalServices.fetchOrganizationProposals({
      organizationId: req.user?.organizationId as string,
      pagination,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @RequiredPermission(Permission.VIEW_PROPOSAL)
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'Fetch all proposals' })
  @ApiOkResponse({ description: 'Proposals fetched successfully' })
  async fetchProposals(
    @Request() req: FastifyRequest,
    @Query() pagination: PaginationParams
  ) {
    const data = await this.proposalServices.fetchAllProposals(pagination);
    return convertAndSendResponse(data);
  }

  @Delete(':id')
  @RequiredPermission(Permission.DELETE_PROPOSAL)
  @ApiOperation({ summary: 'Delete proposal' })
  @ApiOkResponse({ description: 'Proposal deleted successfully' })
  async deleteProposal(
    @Request() req: FastifyRequest,
    @Param('id') proposalId: string
  ) {
    const data = await this.proposalServices.deleteProposal({
      organizationId: req.user?.organizationId as string,
      id: proposalId,
    });
    return convertAndSendResponse(data);
  }
}
