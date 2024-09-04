import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import {
  CartRepository,
  ProcurementItemRepo,
  ProcurementRepo,
} from '../repository';
import {
  AddProcurementPayload,
  ApproveProcurementPayload,
  ProcurementFilters,
  ProcurementStatus,
  UpdateProcurementItem,
} from '../utils';

@Injectable()
export class ProcurementService {
  constructor(
    private procurementRepo: ProcurementRepo,
    private cartRepository: CartRepository,
    private procurementItem: ProcurementItemRepo
  ) {}

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
  async approveProcurement({
    payload,
    id,
    organizationId,
  }: {
    organizationId: string;
    payload: ApproveProcurementPayload;
    id: string;
  }): Promise<IServiceHelper> {
    const procurementItems = await this.procurementItem.fetchProcurementItems({
      organizationId,
      procurementId: id,
    });
    if (procurementItems[0]?.ProcurementStatus !== 'pending')
      return {
        status: 'bad-request',
        message: 'Procurement has either been approved or declined ',
      };
    const unaccountedItems = procurementItems.filter(
      (item) =>
        !payload.items.some(
          (payloadItem) =>
            payloadItem.procurementItemId === item.procurementItemId
        )
    );

    if (unaccountedItems.length > 0)
      return {
        status: 'bad-request',
        message: 'Some items are left approved/rejected',
      };
    const data: UpdateProcurementItem[] = [];
    for (const procurementItem of procurementItems) {
      const approvedItem = payload.items.find(
        (item) => item.procurementItemId === procurementItem.procurementItemId
      );
      if (approvedItem) {
        if (approvedItem.isAccepted) {
          data.push({
            id: procurementItem.procurementItemId,
            status: 'accepted',
            comment: approvedItem.comment,
          });
        } else {
          data.push({
            id: procurementItem.procurementItemId,
            status: 'rejected',
            comment: approvedItem.comment,
          });
        }
      }
    }
    const allItemsRejected = data.every((item) => item.status === 'rejected');
    const procurementStatus: ProcurementStatus = allItemsRejected
      ? 'declined'
      : 'approved';

    await this.procurementRepo.approveProcurement({
      payload: data,
      procurementStatus,
    });
    return {
      status: 'successful',
      message: 'Procurement approved successfully',
    };
  }
}
