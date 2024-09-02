import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { CartRepository } from '../repository';
import { AddProductToCartPayload } from './dto/addProductToCartDto';

@Injectable()
export class CartService {
  constructor(private cartRepo: CartRepository) {}

  async addProductToCart({
    userId,
    payload,
  }: {
    userId: string;
    payload: AddProductToCartPayload;
  }): Promise<IServiceHelper> {
    const { productId, variantId, quantity } = payload;
    const cartItem = await this.cartRepo.fetchCartItem({
      userId,
      productId,
      variantId,
    });

    if (cartItem) {
      await this.cartRepo.updateCart({
        quantity,
        productId,
        userId,
      });
    } else {
      await this.cartRepo.addToCart({ ...payload, userId });
    }
    return {
      status: 'successful',
      message: 'Product added to cart successfully',
    };
  }
  async fetchCartItems(userId: string): Promise<IServiceHelper> {
    const cartItems = await this.cartRepo.fetchUserCartItems(userId);
    return {
      status: 'successful',
      message: 'Cart items fetched successfully',
      data: cartItems,
    };
  }

  async removeCartItem(ids: {
    userId: string;
    id: string;
  }): Promise<IServiceHelper> {
    await this.cartRepo.deleteCartItem(ids);
    return {
      status: 'deleted',
      message: 'Cart item removed successfully',
    };
  }
}
