import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { ProposalRepo } from '../repository/proposal';
import { CreateProposalPayload } from '../utils';

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
}
