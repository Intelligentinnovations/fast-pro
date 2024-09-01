import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  AddProductToCartPayload,
  UpdateProductToCartPayload,
} from '../cart/dto/addProductToCartDto';
import { DB } from '../utils';

@Injectable()
export class CartRepository {
  constructor(private client: KyselyService<DB>) { }

  async fetchCartItem({
    userId,
    productId,
    variantId,
  }: {
    userId: string;
    productId: string;
    variantId?: string;
  }) {
    const query = this.client
      .selectFrom('CartItem')
      .select(['id', 'productId', 'variantId', 'quantity'])
      .where('userId', '=', userId)
      .where('productId', '=', productId);

    if (variantId) {
      query.where('variantId', '=', variantId);
    }
    return query.executeTakeFirst();
  }

  async fetchUserCartItems(userId: string) {
    const cartItems = await this.client
      .selectFrom('CartItem')
      .innerJoin('Product', 'CartItem.productId', 'Product.id')
      .leftJoin('ProductVariant', 'CartItem.variantId', 'ProductVariant.id')
      .innerJoin('Vendor', 'Vendor.id', 'Product.vendorId')
      .leftJoin('ProductImage', 'Product.id', 'ProductImage.productId')
      .select([
        'CartItem.id',
        'CartItem.productId',
        'CartItem.variantId',
        'CartItem.quantity',
        'Product.name as productName',
        'Product.basePrice',
        'Product.quantity as baseProductQuantityInStock',
        'ProductImage.imageUrl',
        'Vendor.name as vendorName',
        'ProductVariant.name as variant',
        'ProductVariant.price as variantPrice',
        'ProductVariant.quantity as variantQuantityInStock',
      ])
      .where('CartItem.userId', '=', userId)
      .where('ProductImage.isPrimary', '=', true)
      .execute();

    if (!cartItems.length) return [];

    const results = cartItems.map(
      ({
        id,
        productId,
        variantId,
        quantity,
        productName,
        imageUrl,
        vendorName,
        basePrice,
        variant,
        variantPrice,
        baseProductQuantityInStock,
        variantQuantityInStock,
      }) => ({
        id,
        quantity,
        productId,
        variantId,
        productName,
        remainingStock: variantId
          ? variantQuantityInStock
          : baseProductQuantityInStock,
        price: variantId ? Number(variantPrice) : Number(basePrice),
        total:
          quantity * (variantId ? Number(variantPrice) : Number(basePrice)),
        imageUrl,
        vendorName,
        ...(variant ? { variant } : {}),
      })
    );
    const subTotal = results.reduce((acc, item) => acc + item.total, 0);
    return { items: results, subTotal };
  }

  async addToCart(payload: AddProductToCartPayload & { userId: string }) {
    return this.client.insertInto('CartItem').values(payload).execute();
  }

  async updateCart(payload: UpdateProductToCartPayload & { userId: string }) {
    const query = this.client
      .updateTable('CartItem')
      .set(payload)
      .where('userId', '=', payload.userId)
      .where('productId', '=', payload.productId);

    if (payload.variantId) {
      query.where('variantId', '=', payload.variantId);
    }
    return query.execute();
  }

  async deleteCartItem({ userId, id }: { userId: string, id: string }) {
    return this.client
      .deleteFrom('CartItem')
      .where('userId', '=', userId)
      .where('id', '=', id)
      .execute();
  }
}
