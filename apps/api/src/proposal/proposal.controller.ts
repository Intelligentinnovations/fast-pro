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
  ApiCreatedResponse,
  ApiOperation,
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
  Permission,
} from '../utils';
import { ProposalService } from './proposal.service';

@ApiTags('Proposal')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('proposal')
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
}
