import bcrypt from 'bcrypt';

import { UserStatus } from '../../utils/types';
import { dbClient } from '../db';


const UserSeed = {
  run: async () => {
    await dbClient
      .insertInto('Organization')
      .values({
        id: '1ab2610e-b332-46f3-b43e-f740912142e1',
        companySize: '10-50',
        sector: 'Technology',
        name: 'SpaceX',
      })
      .execute();

    await dbClient
      .insertInto('User')
      .values({
        id: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a02',
        firstname: 'joe',
        lastname: 'doe',
        organizationId: '1ab2610e-b332-46f3-b43e-f740912142e1',
        email: 'admin@admin.com',
        password: bcrypt.hashSync('password', 10),
        status: UserStatus.ACTIVE,
      })
      .execute();

    await dbClient
      .insertInto('UserRole')
      .values({
        userId: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a02',
        roleId: '559f6c03-ff5a-4fcb-bbca-cf6e7e562dcd' //admin role

      })
      .execute();
  },
};

export default UserSeed;
