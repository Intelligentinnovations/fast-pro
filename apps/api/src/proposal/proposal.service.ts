import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { ProposalRepo } from '../repository/proposal';
import {
  CreateProposalPayload,
  PaginationParams,
  UpdateProposalPayload,
} from '../utils';

@Injectable()
export class ProposalService {
  constructor(private proposalRepo: ProposalRepo) {}
  async createProposal(
    payload: CreateProposalPayload & { organizationId: string }
  ): Promise<IServiceHelper> {
    const proposal = await this.proposalRepo.createProposal(payload);
    return {
      status: 'created',
      message: 'Proposal created successfully',
      data: proposal,
    };
  }

  async fetchProposal(id: string): Promise<IServiceHelper> {
    const proposal = await this.proposalRepo.fetchProposal(id);
    return {
      status: 'created',
      message: 'Proposal fetched successfully',
      data: proposal,
    };
  }
  async fetchOrganizationProposals({
    organizationId,
    pagination,
  }: {
    pagination: PaginationParams;
    organizationId: string;
  }): Promise<IServiceHelper> {
    const proposals = await this.proposalRepo.fetchOrganizationProposals({
      pagination,
      organizationId,
    });
    return {
      status: 'successful',
      message: 'Proposals fetched successfully',
      data: proposals,
    };
  }

  async fetchAllProposals(
    pagination: PaginationParams
  ): Promise<IServiceHelper> {
    const proposals = await this.proposalRepo.fetchAllProposals(pagination);
    return {
      status: 'successful',
      message: 'Proposals fetched successfully',
      data: proposals,
    };
  }

  async deleteProposal({
    organizationId,
    id,
  }: {
    id: string;
    organizationId: string;
  }): Promise<IServiceHelper> {
    await this.proposalRepo.deleteProposal({
      id,
      organizationId,
    });
    return {
      status: 'deleted',
      message: 'Proposal deleted successfully',
    };
  }

  async updateProposal({
    organizationId,
    id,
    payload,
  }: {
    id: string;
    organizationId: string;
    payload: UpdateProposalPayload;
  }): Promise<IServiceHelper> {
    await this.proposalRepo.updateProposal({
      id,
      organizationId,
      payload,
    });
    return {
      status: 'successful',
      message: 'Proposal updated successfully',
    };
  }
}
