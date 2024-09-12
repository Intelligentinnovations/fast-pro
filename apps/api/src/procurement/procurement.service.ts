import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import {
  CartRepository,
  OrderRepository,
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
    private procurementItem: ProcurementItemRepo,
    private orderRepository: OrderRepository
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
    const procurement = await this.procurementItem.fetchProcurementWithItems({
      organizationId,
      procurementId: id,
    });
    if (!procurement)
      return {
        status: 'not-found',
        message: 'No procurement with the given id was found',
      };
    if (procurement && procurement.procurementStatus !== 'pending')
      return {
        status: 'bad-request',
        message: 'Procurement has either been approved or declined ',
      };
    const unaccountedItems = procurement?.procurementItems.filter(
      (item) =>
        !payload.items.some(
          (payloadItem) =>
            payloadItem.procurementItemId === item.procurementItemId
        )
    );

    if (unaccountedItems && unaccountedItems.length > 0) {
      return {
        status: 'bad-request',
        message: 'Some items are left approved/rejected',
      };
    }
    const data: UpdateProcurementItem[] = [];
    if (procurement) {
      for (const procurementItem of procurement.procurementItems) {
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

      const acceptedItems = data.filter((item) => item.status === 'accepted');
      const acceptedProcurementItems = procurement.procurementItems.filter(
        (item) =>
          acceptedItems.some(
            (acceptedItem) => acceptedItem.id === item.procurementItemId
          )
      );

      const groupedByVendor = acceptedProcurementItems.reduce((acc, item) => {
        if (!acc[item.vendorId]) {
          acc[item.vendorId] = [];
        }
        acc[item.vendorId]?.push(item);
        return acc;
      }, {} as Record<string, typeof acceptedProcurementItems>);

      for (const [vendorId, items] of Object.entries(groupedByVendor)) {
        if (items.length === 0) continue;

        const vendorName = items[0]?.vendorName;
        if (!vendorName) continue;
        const totalAmount = items.reduce((sum, item) => {
          const itemTotal =
            Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0);
          return sum + itemTotal;
        }, 0);

        await this.orderRepository.create({
          organizationId,
          amount: totalAmount.toString(),
          procurementId: procurement.procurementId ?? '',
          requestedBy: procurement.requestedBy,
          vendorId,
          organizationName: '',
          itemDetails: procurement.itemDetails ?? '',
          requiredDate: procurement.requiredDate ?? new Date(),
          orderItems: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: (
              Number(item.quantity) * Number(item.unitPrice)
            ).toString(),
          })),
        });
      }
    }
    return {
      status: 'successful',
      message: 'Procurement approved successfully',
    };
  }
}
