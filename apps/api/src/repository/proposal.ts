import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  CreateProposalPayload,
  DB,
  paginate,
  PaginationParams,
  Proposal,
  UpdateProposalPayload,
} from '../utils';

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

  async fetchProposal({
    id,
    organizationId,
  }: {
    id: string;
    organizationId: string;
  }) {
    return this.client
      .selectFrom('Proposal')
      .selectAll()
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
  async fetchProposals({
    pagination,
    organizationId,
  }: {
    pagination: PaginationParams;
    organizationId: string;
  }) {
    const queryBuilder = this.client
      .selectFrom('Proposal')
      .selectAll()
      .where('organizationId', '=', organizationId);

    return paginate<Proposal>({ queryBuilder, pagination, identifier: 'id' });
  }

  async deleteProposal({
    id,
    organizationId,
  }: {
    id: string;
    organizationId: string;
  }) {
    return this.client
      .deleteFrom('Proposal')
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .execute();
  }

  async updateProposal({
    id,
    organizationId,
    payload,
  }: {
    id: string;
    organizationId: string;
    payload: UpdateProposalPayload;
  }) {
    return this.client
      .updateTable('Proposal')
      .set(payload)
      .where('organizationId', '=', organizationId)
      .where('id', '=', id)
      .execute();
  }
}
