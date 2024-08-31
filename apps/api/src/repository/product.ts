import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  AddProductPayload,
  DB,
  paginate,
  ProductDetails,
  ProductFilters,
  UserData,
} from '../utils';

@Injectable()
export class ProductRepo {
  constructor(private client: KyselyService<DB>) { }
  async addProduct({
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
      const productId = baseProduct?.id as string;
      const productImagesWithProductId =
        images?.map((image) => ({
          isPrimary: image.isPrimary,
          imageUrl: image.url,
          productId,
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
    searchQuery,
    user,
  }: {
    searchQuery: ProductFilters;
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

    if (
      searchQuery.productCategoryNames &&
      searchQuery.productCategoryNames.length > 0
    ) {
      query = query
        .innerJoin(
          'ProductCategory',
          'ProductCategory.id',
          'Product.categoryId'
        )
        .where('ProductCategory.name', 'in', searchQuery.productCategoryNames);
    }

    if (searchQuery.minPrice) {
      query = query.where('Product.basePrice', '>=', searchQuery.minPrice);
    }
    if (searchQuery.maxPrice) {
      query = query.where('Product.basePrice', '<=', searchQuery.maxPrice);
    }
    if (searchQuery.sortBy === 'price') {
      query = query.orderBy('Product.basePrice', searchQuery.sortOrder);
    }

    query = query.groupBy([
      'Product.id',
      'Product.name',
      'Product.description',
      'Product.basePrice',
      'Vendor.name',
      'ProductImage.imageUrl',
    ]);

    return paginate({
      queryBuilder: query,
      pagination: searchQuery,
      identifier: 'Product.id',
    });
  }
  async fetchProductById(id: string) {
    const results = await this.client.selectFrom('Product')
      .innerJoin('Vendor', 'Vendor.id', 'Product.vendorId')
      .leftJoin('ProductImage', 'ProductImage.productId', 'Product.id')
      .leftJoin('ProductSpecification', 'ProductSpecification.productId', 'Product.id')
      .leftJoin('ProductVariant', 'ProductVariant.productId', 'Product.id')
      .select([
        'Product.id',
        'Product.name',
        'Product.description',
        'Product.basePrice as price',
        'Vendor.name as vendorName',
        'ProductImage.imageUrl',
        'ProductSpecification.title as spec',
        'ProductSpecification.value as specValue',
        'ProductVariant.id as variantId',
        'ProductVariant.name as variantName',
        'ProductVariant.price as variantPrice',
      ])
      .where('Product.id', '=', id)
      .execute()

      if (results.length === 0) return {};
      const product: ProductDetails = {
        id: results[0]?.id as string,
        name: results[0]?.name ?? '',
        description: results[0]?.description ?? '',
        price: results[0]?.price ? Number(results[0].price) : 0,
        vendorName: results[0]?.vendorName ?? '',
        images: [],
        specifications: [],
        variants: [],
      };
      for (const row of results) {
        if (row.imageUrl && !product.images.includes(row.imageUrl)) {
          product.images.push(row.imageUrl);
        }
        if (row.spec && row.specValue && !product.specifications.some(s => s.name === row.spec)) {
          product.specifications.push({ name: row.spec, value: row.specValue });
        }
        if (row.variantId) {
          const variant = {
            id: row.variantId as string,
            name: row.variantName as string,
            price: Number(row.variantPrice),
          };
          if (!product.variants.some(v => v.id === variant.id)) {
            product.variants.push(variant);
          }
        }
      }

      return product;
  }
}
