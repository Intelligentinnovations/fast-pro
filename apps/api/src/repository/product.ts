import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';

import {
  AddProductPayload,
  DB,
  paginate,
  Product,
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
          basePrice: (hasVariant
            ? smallestPrice
            : baseProductDetails.price) as string,
          ...baseProductDetailsWithoutPrice,
          vendorId,
          quantity: hasVariant ? totalQuantity : baseProductDetails.quantity,
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
    let baseQuery = this.client
      .selectFrom('Product')
      .innerJoin('Vendor', 'Vendor.id', 'Product.vendorId')
      .leftJoin('ProductImage', (join) =>
        join
          .onRef('ProductImage.productId', '=', 'Product.id')
          .on('ProductImage.isPrimary', '=', true)
      );

    if (user.vendorId) {
      baseQuery = baseQuery.where('Product.vendorId', '=', user.vendorId);
    }

    if (
      searchQuery.productCategoryNames &&
      searchQuery.productCategoryNames.length > 0
    ) {
      baseQuery = baseQuery
        .innerJoin(
          'ProductCategory',
          'ProductCategory.id',
          'Product.categoryId'
        )
        .where('ProductCategory.name', 'in', searchQuery.productCategoryNames);
    }

    if (searchQuery.minPrice) {
      baseQuery = baseQuery.where(
        'Product.basePrice',
        '>=',
        searchQuery.minPrice
      );
    }
    if (searchQuery.maxPrice) {
      baseQuery = baseQuery.where(
        'Product.basePrice',
        '<=',
        searchQuery.maxPrice
      );
    }

    let dataQuery = baseQuery.select([
      'Product.id',
      'Product.name',
      'Product.description',
      'Product.basePrice as price',
      'Vendor.name as vendorName',
      'ProductImage.imageUrl as primaryImageUrl',
    ]);

    if (searchQuery.sortBy === 'price') {
      dataQuery = dataQuery.orderBy('Product.basePrice', searchQuery.sortOrder);
    }

    return paginate<Product>({
      queryBuilder: dataQuery,
      pagination: searchQuery,
      identifier: 'Product.id',
    });
  }
  async fetchProductById(id: string): Promise<ProductDetails | undefined> {
    const results = await this.client
      .selectFrom('Product')
      .innerJoin('Vendor', 'Vendor.id', 'Product.vendorId')
      .leftJoin('ProductImage', 'ProductImage.productId', 'Product.id')
      .leftJoin(
        'ProductSpecification',
        'ProductSpecification.productId',
        'Product.id'
      )
      .leftJoin('ProductVariant', 'ProductVariant.productId', 'Product.id')
      .select([
        'Product.id',
        'Product.name',
        'Product.description',
        'Product.quantity',
        'Product.basePrice as price',
        'Vendor.name as vendorName',
        'ProductImage.imageUrl',
        'ProductImage.isPrimary',
        'ProductSpecification.title as spec',
        'ProductSpecification.value as specValue',
        'ProductVariant.id as variantId',
        'ProductVariant.name as variantName',
        'ProductVariant.price as variantPrice',
        'ProductVariant.quantity as variantQuantity',
      ])
      .where('Product.id', '=', id)
      .execute();

    if (results.length === 0) return undefined;
    const product: ProductDetails = {
      id: results[0]?.id as string,
      name: results[0]?.name ?? '',
      description: results[0]?.description ?? '',
      price: results[0]?.price ? Number(results[0].price) : 0,
      quantity: results[0]?.quantity ? Number(results[0].quantity) : 0,
      vendorName: results[0]?.vendorName ?? '',
      images: [],
      specifications: [],
      variants: [],
    };
    for (const row of results) {
      if (
        row.imageUrl &&
        !product.images.some((value) => value.imageUrl === row.imageUrl)
      ) {
        product.images.push({
          imageUrl: row.imageUrl,
          isPrimary: row.isPrimary ?? false,
        });
      }
      if (
        row.spec &&
        row.specValue &&
        !product.specifications.some((s) => s.name === row.spec)
      ) {
        product.specifications.push({ name: row.spec, value: row.specValue });
      }
      if (row.variantId) {
        const variant = {
          id: row.variantId as string,
          name: row.variantName as string,
          price: Number(row.variantPrice),
          quantity: Number(row.variantQuantity),
        };
        if (!product.variants.some((v) => v.id === variant.id)) {
          product.variants.push(variant);
        }
      }
    }

    return product;
  }
}
