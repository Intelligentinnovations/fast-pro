import { v4 as uuidv4 } from 'uuid';

import { dbClient } from '../db';

const vendor1 = 'd8daaf29-c35d-420d-8026-b8bfbe4e1c3c';
const vendorId2 = 'd8daaf29-c35d-420d-8026-b8bfbe4e1c37';
const electronicsId = '1e4332d4-79f1-4df0-af38-091cf651b0fd';

const ProductCategorySeed = {
  run: async () => {
    await dbClient
      .insertInto('ProductCategory')
      .values([
        {
          id: electronicsId,
          name: 'Electronics',
        },
        {
          id: 'e530acda-9e23-47d7-a6cf-37233cb71b08',
          name: 'Furniture',
        },
        {
          id: 'e6453b92-6f34-40bd-a18a-be5b5fb829af',
          name: 'Books',
        },
        {
          name: 'Sports & Outdoors',
          id: '35275783-4ed5-40d3-8888-17fa7b9f5350',
        },
        {
          id: 'a35a58c3-4bd3-4ea3-a39e-cb00122193e0',
          name: 'Toys & Games',
        },
        {
          id: 'ebed7702-cb9f-40b7-84ef-cd1c8c4ea37e',
          name: 'Automotive',
        },
      ])
      .execute();

    await dbClient.transaction().execute(async (trx) => {
      // Insert products
      const products = await trx
        .insertInto('Product')
        .values([
          {
            id: uuidv4(),
            name: 'Logitech MX Master 3 Mouse',
            description:
              'Ergonomic wireless mouse with advanced features for productivity.',
            basePrice: '99.99',
            quantity: 2,
            vendorId: vendor1,
            categoryId: electronicsId,
          },
          {
            id: uuidv4(),
            name: 'HP Deskjet 2720 All-in-One Printer',
            categoryId: electronicsId,
            basePrice: '149.99',
            description:
              'Compact all-in-one printer for home use with wireless printing',
            quantity: 2,
            vendorId: vendor1,
          },
          {
            id: uuidv4(),
            name: 'Apple MacBook Air M1',
            categoryId: electronicsId,
            basePrice: '999.99',
            description:
              '13-inch MacBook Air with Apple M1 chip for powerful performance.',
            quantity: 2,
            vendorId: vendor1,
          },
          {
            id: uuidv4(),
            name: 'Sony Bravia X90J 55-inch TV',
            categoryId: electronicsId,
            basePrice: '999.99',
            description:
              '55-inch 4K Ultra HD Smart LED TV with Google TV and HDR support.',
            quantity: 2,
            vendorId: vendor1,
          },
          {
            id: uuidv4(),
            name: 'Samsung Galaxy S21 Ultra',
            categoryId: electronicsId,
            basePrice: '1199.99',
            description: 'Flagship smartphone with 108MP camera and 100x zoom.',
            quantity: 2,
            vendorId: vendorId2,
          },
          {
            id: uuidv4(),
            name: 'Bose QuietComfort 35 II Headphones',
            categoryId: electronicsId,
            basePrice: '299.99',
            description:
              'Wireless noise-cancelling headphones with Alexa voice control.',
            quantity: 2,
            vendorId: vendorId2,
          },
          {
            id: uuidv4(),
            name: 'Nintendo Switch Console',
            categoryId: electronicsId,
            basePrice: '299.99',
            description: 'Versatile gaming console for home and handheld play.',
            quantity: 2,
            vendorId: vendorId2,
          },
        ])
        .returning(['id', 'name'])
        .execute();

      // Insert product images
      await trx
        .insertInto('ProductImage')
        .values(products.flatMap((product) => [
          {
            productId: product.id,
            imageUrl: `https://example.com/${product.name.toLowerCase().replace(/ /g, '-')}-1.jpg`,
            isPrimary: true
          },
          {
            productId: product.id,
            imageUrl: `https://example.com/${product.name.toLowerCase().replace(/ /g, '-')}-2.jpg`,
            isPrimary: false
          },
          {
            productId: product.id,
            imageUrl: `https://example.com/${product.name.toLowerCase().replace(/ /g, '-')}-3.jpg`,
            isPrimary: false
          }
        ]))
        .execute();

      // Insert product specifications
      const specifications = [
        { productName: 'Logitech MX Master 3 Mouse', titles: ['Connectivity', 'Battery Life'], values: ['Wireless', 'Up to 70 days'] },
        { productName: 'HP OfficeJet Pro 9015 Printer', titles: ['Print Speed', 'Connectivity'], values: ['Up to 7.5 ppm', 'Wi-Fi, USB'] },
        { productName: 'Apple MacBook Air', titles: ['Processor', 'RAM'], values: ['Apple M1 chip', '8GB'] },
        { productName: 'Sony Bravia XR A80J OLED TV', titles: ['Resolution', 'Smart TV'], values: ['4K Ultra HD', 'Google TV'] },
        { productName: 'Samsung Galaxy S21 Ultra', titles: ['Camera', 'Display'], values: ['108MP main sensor', '6.8-inch Dynamic AMOLED'] },
        { productName: 'Bose QuietComfort 35 II Headphones', titles: ['Noise Cancellation', 'Battery Life'], values: ['Active Noise Cancelling', 'Up to 20 hours'] },
        { productName: 'Nintendo Switch Console', titles: ['Screen', 'Storage'], values: ['6.2-inch touch screen', '32GB internal'] },
      ];

      await trx
        .insertInto('ProductSpecification')
        .values(products.flatMap((product) => {
          const spec = specifications.find(s => s.productName === product.name);
          if (spec) {
            return spec.titles.map((title, i) => ({
              productId: product.id,
              title,
              value: spec.values[i] ?? ''
            }));
          }
          // If no matching specification is found, add a default one
          return [{
            productId: product.id,
            title: 'General',
            value: 'Standard specification'
          }];
        }))
        .execute();

      // Insert product variants for some products
      const variantProducts = [products[2], products[4]]; // MacBook Air and Galaxy S21 Ultra
      const variants = [
        [
          { name: '256GB Storage', price: '999.99', quantity: 1 },
          { name: '512GB Storage', price: '1249.99', quantity: 1 },
        ],
        [
          { name: '128GB Storage', price: '1199.99', quantity: 1 },
          { name: '256GB Storage', price: '1299.99', quantity: 1 },
        ],
      ];

      await trx
        .insertInto('ProductVariant')
        .values(variantProducts.flatMap((product, index) => 
          variants[index]?.map(variant => ({
            productId: product?.id,
            ...variant
          }))
        ).filter((variant): variant is { productId: string; name: string; price: string; quantity: number } => 
          variant?.productId !== undefined
        ))
        .execute();
    });
  },
};

export default ProductCategorySeed;
