import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { ProposalRequestRepo } from '../repository/proposalRequest';
import { CreateProposalRequestPayload, PaginationParams } from '../utils';

@Injectable()
export class ProposalRequestService {
  constructor(private proposalRequestRepo: ProposalRequestRepo) {}
  async createProposalRequest(
    payload: CreateProposalRequestPayload & { vendorId: string }
  ): Promise<IServiceHelper> {
    const proposal = await this.proposalRequestRepo.createProposalRequest(
      payload
    );
    return {
      status: 'created',
      message: 'Proposal request created successfully',
      data: proposal,
    };
  }

  async fetchOrganizationProposalRequests({
    proposalId,
    pagination,
    organizationId,
  }: {
    pagination: PaginationParams;
    organizationId: string;
    proposalId: string;
  }): Promise<IServiceHelper> {
    const proposals =
      await this.proposalRequestRepo.fetchOrganizationProposalRequest({
        proposalId,
        pagination,
        organizationId,
      });
    return {
      status: 'successful',
      message: 'Proposal requests fetched successfully',
      data: proposals,
    };
  }

  async fetchVendorProposalRequests({
    pagination,
    vendorId,
  }: {
    pagination: PaginationParams;
    vendorId: string;
  }): Promise<IServiceHelper> {
    const proposalRequests =
      await this.proposalRequestRepo.fetchVendorProposalRequests({
        pagination,
        vendorId,
      });
    return {
      status: 'successful',
      message: 'Proposals fetched successfully',
      data: proposalRequests,
    };
  }
  //
  // async deleteProposal({
  //   organizationId,
  //   id,
  // }: {
  //   id: string;
  //   organizationId: string;
  // }): Promise<IServiceHelper> {
  //   await this.proposalRequestRepo.deleteProposal({
  //     id,
  //     organizationId,
  //   });
  //   return {
  //     status: 'deleted',
  //     message: 'Proposal deleted successfully',
  //   };
  // }
  //
  async approveProposalRequest({
    organizationId,
    id,
  }: {
    id: string;
    organizationId: string;
  }): Promise<IServiceHelper> {
    await this.proposalRequestRepo.approveProposalRequest({
      proposalRequestId: id,
      organizationId,
    });
    return {
      status: 'successful',
      message: 'Proposal request approved successfully',
    };
  }
  async rejectProposalRequest({
    organizationId,
    id,
  }: {
    id: string;
    organizationId: string;
  }): Promise<IServiceHelper> {
    await this.proposalRequestRepo.updateProposalRequest({
      proposalRequestId: id,
      organizationId,
    });
    return {
      status: 'successful',
      message: 'Proposal request rejected successfully',
    };
  }
}
