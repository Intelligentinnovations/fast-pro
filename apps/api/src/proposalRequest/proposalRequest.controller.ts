import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
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
  CreateProposalRequestPayload,
  CreateProposalRequestSchema,
  PaginationParams,
  Permission,
} from '../utils';
import { ProposalRequestService } from './proposalRequest.service';

@ApiTags('Proposal Request')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('proposal-requests')
export class ProposalRequestController {
  constructor(
    private readonly proposalRequestService: ProposalRequestService
  ) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_PROPOSAL_REQUEST)
  @ApiOperation({ summary: 'Create proposal request' })
  @ApiBody({
    description: 'Proposal request payload',
    schema: zodToApi(CreateProposalRequestSchema),
  })
  @ApiCreatedResponse({ description: 'Proposal request created successfully' })
  @UsePipes(new ZodValidationPipe(CreateProposalRequestSchema))
  async createProposal(
    @Body() payload: CreateProposalRequestPayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.proposalRequestService.createProposalRequest({
      ...payload,
      vendorId: req.user?.vendorId as string,
    });
    return convertAndSendResponse(data);
  }

  @Put('approve/:id')
  @RequiredPermission(Permission.UPDATE_PROPOSAL_REQUEST)
  @ApiOperation({ summary: 'Approve a proposal request' })
  @ApiOkResponse({ description: 'Proposal request approved successfully' })
  async approveProposal(
    @Request() req: FastifyRequest,
    @Param('id') id: string
  ) {
    const data = await this.proposalRequestService.approveProposalRequest({
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Put('reject/:id')
  @RequiredPermission(Permission.UPDATE_PROPOSAL_REQUEST)
  @ApiOperation({ summary: 'Rejects a proposal request' })
  @ApiCreatedResponse({ description: 'Proposal request rejected successfully' })
  async rejectProposal(
    @Request() req: FastifyRequest,
    @Param('id') id: string
  ) {
    const data = await this.proposalRequestService.rejectProposalRequest({
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @RequiredPermission(Permission.VIEW_PROPOSAL_REQUEST)
  @ApiOperation({ summary: 'Fetch vendor proposal requests' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOkResponse({ description: 'Proposal request fetched successfully' })
  async fetchProposal(
    @Request() req: FastifyRequest,
    @Query() pagination: PaginationParams
  ) {
    const data = await this.proposalRequestService.fetchVendorProposalRequests({
      vendorId: req.user?.vendorId as string,
      pagination,
    });
    return convertAndSendResponse(data);
  }

  @Get('proposal/:id')
  @RequiredPermission(Permission.VIEW_PROPOSAL_REQUEST)
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'Fetch organization proposal requests' })
  @ApiOkResponse({ description: 'Proposal requests fetched successfully' })
  async fetchProposals(
    @Request() req: FastifyRequest,
    @Query() pagination: PaginationParams,
    @Param('id') proposalId: string
  ) {
    const data =
      await this.proposalRequestService.fetchOrganizationProposalRequests({
        pagination,
        proposalId,
        organizationId: req.user?.organizationId as string,
      });
    return convertAndSendResponse(data);
  }

  // @Delete(':id')
  // @RequiredPermission(Permission.DELETE_PROPOSAL_REQUEST)
  // @ApiOperation({ summary: 'Delete proposal' })
  // @ApiOkResponse({ description: 'Proposal deleted successfully' })
  // async deleteProposal(
  //   @Request() req: FastifyRequest,
  //   @Param('id') proposalId: string
  // ) {
  //   const data = await this.proposalRequestService.deleteProposal({
  //     organizationId: req.user?.organizationId as string,
  //     id: proposalId,
  //   });
  //   return convertAndSendResponse(data);
  // }
}
