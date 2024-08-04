import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  CreateProposalRequestPayload,
  DB,
  paginate,
  PaginationParams,
  ProposalRequest,
  ProposalRequestData,
} from '../utils';

@Injectable()
export class ProposalRequestRepo {
  constructor(private client: KyselyService<DB>) {}

  async createProposalRequest(
    payload: CreateProposalRequestPayload & { vendorId: string }
  ) {
    return this.client
      .insertInto('ProposalRequest')
      .values(payload)
      .returningAll()
      .execute();
  }

  async fetchOrganizationProposalRequest({
    proposalId,
    organizationId,
    pagination,
  }: {
    proposalId: string;
    organizationId: string;
    pagination: PaginationParams;
  }) {
    const queryBuilder = this.client
      .selectFrom('ProposalRequest')
      .innerJoin('Proposal', 'ProposalRequest.proposalId', 'Proposal.id')
      .innerJoin('Vendor', 'vendorId', 'Vendor.id')
      .select([
        'ProposalRequest.id',
        'Proposal.title as proposalTitle',
        'Vendor.name as vendorName',
        'Vendor.email as vendorEmail',
        'ProposalRequest.title as vendorProposalTitle',
        'ProposalRequest.attachments as vendorAttachments',
        'ProposalRequest.summary as vendorSummary',
        'ProposalRequest.created_at as createdAt',
      ])
      .where('proposalId', '=', proposalId)
      .where('Proposal.organizationId', '=', organizationId);

    return paginate<ProposalRequestData>({
      queryBuilder,
      pagination,
      identifier: 'ProposalRequest.id',
    });
  }
  async fetchVendorProposalRequests({
    vendorId,
    pagination,
  }: {
    vendorId: string;
    pagination: PaginationParams;
  }) {
    const queryBuilder = this.client
      .selectFrom('ProposalRequest')
      .innerJoin('Proposal', 'ProposalRequest.proposalId', 'Proposal.id')
      .select([
        'ProposalRequest.created_at as createdAt',
        'ProposalRequest.title',
        'ProposalRequest.status',
        'Proposal.dateRequired as proposalDeliveryDate',
      ])
      .where('vendorId', '=', vendorId);

    return paginate<ProposalRequest>({
      queryBuilder,
      pagination,
      identifier: 'ProposalRequest.id',
    });
  }

  async approveProposalRequest({
    proposalRequestId,
    organizationId,
  }: {
    proposalRequestId: string;
    organizationId: string;
  }) {
    return this.client.transaction().execute(async (trx) => {
      const proposalRequest = await trx
        .updateTable('ProposalRequest')
        .returning('proposalId')
        .set({ status: 'ACCEPTED' })
        .where('id', '=', proposalRequestId)
        .where('status', '=', 'SUBMITTED')
        .executeTakeFirstOrThrow();

      await trx
        .updateTable('Proposal')
        .set({ status: 'CLOSED' })
        .where('id', '=', proposalRequest.proposalId)
        .where('organizationId', '=', organizationId)
        .executeTakeFirstOrThrow();

      return proposalRequest;
    });
  }

  async updateProposalRequest({
    proposalRequestId,
    organizationId,
  }: {
    proposalRequestId: string;
    organizationId: string;
  }) {
    await this.client
      .with('filtered_proposal_request', (db) =>
        db
          .selectFrom('ProposalRequest')
          .innerJoin('Proposal', 'ProposalRequest.proposalId', 'Proposal.id')
          .select('ProposalRequest.id as id')
          .where('ProposalRequest.id', '=', proposalRequestId)
          .where('Proposal.organizationId', '=', organizationId)
          .where('ProposalRequest.status', '=', 'SUBMITTED')
      )
      .updateTable('ProposalRequest')
      .set({ status: 'REJECTED' })
      .where('ProposalRequest.id', 'in', (db) =>
        db.selectFrom('filtered_proposal_request').select('id')
      )
      .execute();
  }
}
