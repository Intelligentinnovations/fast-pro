import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { ProductRepo } from '../repository';
import { AddProductPayload, ProductFilters, UserData } from '../utils';

@Injectable()
export class ProductService {
  constructor(private productRepo: ProductRepo) { }

  async addProduct({
    vendorId,
    payload,
  }: {
    vendorId: string;
    payload: AddProductPayload;
  }): Promise<IServiceHelper> {
    const product = await this.productRepo
      .addProduct({ payload, vendorId });
    return {
      status: 'created',
      message: 'Product added successfully',
      data: product,
    };
  }

  async fetchProducts({
    query,
    user,
  }: {
    query: ProductFilters;
    user: UserData;
  }): Promise<IServiceHelper> {
    const proposalRequests = await this.productRepo
      .fetchProducts({
        searchQuery: query,
        user,
      });
    return {
      status: 'successful',
      message: 'Products fetched successfully',
      data: proposalRequests,
    };
  }
  async getProduct(id: string): Promise<IServiceHelper> {
    const product = await this.productRepo.fetchProductById(id)

    // if (!product) return {
    //   status: 'not-found',
    //   message: 'Product not found'
    // }

    return {
      status: 'successful',
      message: 'Product fetched successfully',
      data: product
    }
  }
}
