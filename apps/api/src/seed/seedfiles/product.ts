import { dbClient } from '../db';

const ProductCategorySeed = {
  run: async () => {
    await dbClient
      .insertInto('ProductCategory')
      .values([
        {
          name: 'Electronics',
        },
        {
          name: 'Furniture',
        },
        {
          name: 'Books',
        },
        {
          name: 'Sports & Outdoors',
        },
        {
          name: 'Toys & Games',
        },
        {
          name: 'Automotive',
        },
      ])
      .execute();
  },
};

export default ProductCategorySeed;
