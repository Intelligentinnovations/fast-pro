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

  async fetchProposal(id: string) {
    return this.client
      .selectFrom('Proposal')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
  async fetchOrganizationProposals({
    pagination,
    organizationId,
  }: {
    pagination: PaginationParams;
    organizationId: string;
  }) {
    const queryBuilder = this.client
      .selectFrom('Proposal')
      .innerJoin(
        'ProposalCategory',
        'Proposal.categoryId',
        'ProposalCategory.id'
      )
      .innerJoin('Organization', 'Proposal.organizationId', 'Organization.id')
      .select([
        'Proposal.id',
        'title',
        'Proposal.description as description',
        'Proposal.created_at as createdAt',
        'Proposal.status',
        'ProposalCategory.name as categoryName',
        'dateRequired',
        'Organization.name as organizationName',
      ])
      .where('organizationId', '=', organizationId);

    return paginate<Proposal>({
      queryBuilder,
      pagination,
      identifier: 'Proposal.id',
    });
  }

  async fetchAllProposals(pagination: PaginationParams) {
    const queryBuilder = this.client
      .selectFrom('Proposal')
      .innerJoin(
        'ProposalCategory',
        'Proposal.categoryId',
        'ProposalCategory.id'
      )
      .innerJoin('Organization', 'Proposal.organizationId', 'Organization.id')
      .select([
        'Proposal.id',
        'title',
        'Proposal.description as description',
        'Proposal.created_at as createdAt',
        'Proposal.status',
        'ProposalCategory.name as categoryName',
        'dateRequired',
        'Organization.name as organizationName',
      ])
      .where('status', '=', 'open');
    return paginate<Proposal>({
      queryBuilder,
      pagination,
      identifier: 'Proposal.id',
    });
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
