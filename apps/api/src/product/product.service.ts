import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { ProductRepo } from '../repository';
import { AddProductPayload, PaginationParams, UserData } from '../utils';

@Injectable()
export class ProductService {
  constructor(private productRepo: ProductRepo) {}

  async addProduct({
    vendorId,
    payload,
  }: {
    vendorId: string;
    payload: AddProductPayload;
  }): Promise<IServiceHelper> {
    const product = await this.productRepo.createProduct({ payload, vendorId });
    return {
      status: 'created',
      message: 'Product added successfully',
      data: product,
    };
  }

  async fetchProducts({
    pagination,
    user,
  }: {
    pagination: PaginationParams;
    user: UserData;
  }): Promise<IServiceHelper> {
    const proposalRequests = await this.productRepo.fetchProducts({
      pagination,
      user,
    });
    return {
      status: 'successful',
      message: 'Products fetched successfully',
      data: proposalRequests,
    };
  }
}
