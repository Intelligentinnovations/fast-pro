import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { CartRepository, ProcurementItemRepo, ProcurementRepo } from '../repository';
import { ApproveProcurementPayload, ProcurementFilters, ProcurementStatus, UpdateProcurementItem } from '../utils';
import { AddProcurementPayload } from '../utils/schema/procurement';

@Injectable()
export class ProcurementService {
  constructor(
    private procurementRepo: ProcurementRepo,
    private cartRepository: CartRepository,
    private procurementItem: ProcurementItemRepo
  ) { }

  async createProcurement(
    payload: AddProcurementPayload & { userId: string; organizationId: string }
  ): Promise<IServiceHelper> {
    const { userId, organizationId } = payload;
    const { items, subTotal } = await this.cartRepository.fetchUserCartItems(
      userId
    );
    if (!items.length)
      return {
        status: 'not-found',
        message: 'Please add items to cart to continue',
      };
    await this.procurementRepo.createProcurement(
      { ...payload, userId, organizationId, amount: subTotal.toString() },
      items
    );
    await this.cartRepository.clearCartItems(userId);

    return {
      status: 'created',
      message: 'Procurement created successfully',
    };
  }

  async fetchProcurements({
    query,
    organizationId,
  }: {
    query: ProcurementFilters;
    organizationId: string;
  }): Promise<IServiceHelper> {
    const procurements = await this.procurementRepo.fetchProcurements({
      organizationId,
      query,
    });
    return {
      status: 'successful',
      message: 'Procurements fetched successfully',
      data: procurements,
    };
  }

  async getProcurement({
    id,
    organizationId,
  }: {
    id: string;
    organizationId: string;
  }): Promise<IServiceHelper> {
    const procurement = await this.procurementRepo.fetchProcurementById({
      id,
      organizationId,
    });
    if (!procurement) {
      return {
        status: 'not-found',
        message: 'Procurement not found',
      };
    }
    return {
      status: 'successful',
      message: 'Procurement fetched successfully',
      data: procurement,
    };
  }
  async approveProcurement(
    { payload, id }: { payload: ApproveProcurementPayload; id: string }
  ): Promise<IServiceHelper> {

    const procurementItems = await this.procurementItem.fetchProcurementItems(id);

    const data: UpdateProcurementItem[] = [];
    for (const procurementItem of procurementItems) {
      const approvedItem = payload.items.find(item => item.procurementItemId === procurementItem.id);
      if (approvedItem) {
        if (approvedItem.isAccepted) {
          data.push({ procurementItemId: procurementItem.id, status: 'accepted' });
        } else {
          data.push({ procurementItemId: procurementItem.id, status: 'rejected' });
        }
      }
    }
    const unaccountedItems = payload.items.filter(item =>
      !procurementItems.some(procItem => procItem.id === item.procurementItemId)
    );
    const procurementStatus: ProcurementStatus = unaccountedItems.length === procurementItems.length ? 'declined' : 'approved'

    await this.procurementRepo.approveProcurement({ payload: data, procurementStatus });
    return {
      status: 'successful',
      message: 'Procurement approved successfully',
    };
  }
}
