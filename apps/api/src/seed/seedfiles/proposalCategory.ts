import { randomUUID } from 'crypto';

import { dbClient } from '../db';

const ProposalCategorySeed = {
  run: async () => {
    await dbClient
      .insertInto('ProposalCategory')
      .values([
        {
          id: randomUUID(),
          name: 'Legal Proposal',
        },
        {
          id: randomUUID(),
          name: 'Business Proposal',
        },
        {
          id: randomUUID(),
          name: 'Technology Proposal',
        },
      ])
      .execute();
  },
};

export default ProposalCategorySeed;
