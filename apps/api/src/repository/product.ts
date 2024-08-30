import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  AddProductPayload,
  DB,
  paginate,
  PaginationParams,
  UserData,
} from '../utils';

@Injectable()
export class ProductRepo {
  constructor(private client: KyselyService<DB>) {}
  async createProduct({
    payload,
    vendorId,
  }: {
    payload: AddProductPayload;
    vendorId: string;
  }) {
    const { variants, specifications, images, ...baseProductDetails } = payload;
    return this.client.transaction().execute(async (trx) => {
      const hasVariant = variants && variants.length > 0;

      const { smallestPrice, totalQuantity } = variants
        ? variants.reduce(
            (acc, currValue) => {
              return {
                totalQuantity: acc.totalQuantity + currValue.quantity,
                smallestPrice: Math.min(
                  acc.smallestPrice,
                  Number(currValue.price)
                ),
              };
            },
            { totalQuantity: 0, smallestPrice: Infinity }
          )
        : { totalQuantity: 0, smallestPrice: Infinity };

      const { price: _, ...baseProductDetailsWithoutPrice } =
        baseProductDetails;

      const baseProduct = await trx
        .insertInto('Product')
        .values({
          ...baseProductDetailsWithoutPrice,
          quantity: hasVariant ? totalQuantity : baseProductDetails.quantity,
          vendorId,
          basePrice: hasVariant
            ? smallestPrice.toString()
            : baseProductDetails.price,
        })
        .returning([
          'id',
          'basePrice',
          'vendorId',
          'name',
          'description',
          'quantity',
          'categoryId',
        ])
        .executeTakeFirst();
      const productId = baseProduct?.id as string
      const productImagesWithProductId =
        images?.map((image) => ({
          isPrimary: image.isPrimary,
          imageUrl: image.url,
          productId
        })) ?? [];

      const productImages = await trx
        .insertInto('ProductImage')
        .values(productImagesWithProductId)
        .returning(['id', 'productId', 'imageUrl', 'isPrimary'])
        .execute();

      const productSpecsWithProductId =
        specifications?.map((spec) => ({
          ...spec,
          productId,
        })) ?? [];

      const productSpecs = await trx
        .insertInto('ProductSpecification')
        .values(productSpecsWithProductId)
        .returning(['id', 'productId', 'title', 'value'])
        .execute();

      let productVariants;
      if (hasVariant) {
        const productVariantsWithProductId = variants.map((variant) => ({
          ...variant,
          price: variant.price.toString(),
          productId,
        }));

        productVariants = await trx
          .insertInto('ProductVariant')
          .values(productVariantsWithProductId)
          .returning(['id', 'productId', 'name', 'price', 'quantity'])
          .execute();
      }
      return {
        ...baseProduct,
        productImages,
        productSpecs,
        productVariants,
      };
    });
  }
  async fetchProducts({
    pagination,
    user,
  }: {
    pagination: PaginationParams;
    user: UserData;
  }) {
    let query = this.client
      .selectFrom('Product')
      .innerJoin('Vendor', 'Vendor.id', 'Product.vendorId')
      .leftJoin('ProductImage', 'ProductImage.productId', 'Product.id')
      .where('ProductImage.isPrimary', '=', true)
      .select([
        'Product.id',
        'Product.name',
        'Product.description',
        'Product.basePrice as price',
        'Vendor.name as vendorName',
        'ProductImage.imageUrl as primaryImageUrl',
      ]);
    if (user.vendorId) {
      query = query.where('Product.vendorId', '=', user.vendorId);
    }

    return paginate({
      queryBuilder: query,
      pagination,
      identifier: 'Product.id',
    });
  }
}
