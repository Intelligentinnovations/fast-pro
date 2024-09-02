import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { CartRepository, ProcurementRepo } from '../repository';
import { ProcurementFilters } from '../utils';
import { AddProcurementPayload } from './dto/addProcurementDto';

@Injectable()
export class ProcurementService {
  constructor(
    private procurementRepo: ProcurementRepo,
    private cartRepository: CartRepository
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

  async getProcurement(id: string): Promise<IServiceHelper> {
    const procurement = await this.procurementRepo.fetchProcurementById(id);
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
}
