import { KyselyService } from '@backend-template/database';

import { DB } from '../utils/types';

export const dbClient = new KyselyService<DB>(process.env.DATABASE_URL ?? '');
