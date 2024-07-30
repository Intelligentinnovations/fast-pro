import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import { CreateProposalPayload, DB } from '../utils';

@Injectable()
export class ProposalRepo {
  constructor(private client: KyselyService<DB>) {}
  async createProposal(
    payload: CreateProposalPayload & { organizationId: string }
  ) {
    return this.client
      .insertInto('Proposal')
      .values(payload)
      .returningAll()
      .execute();
  }
}
