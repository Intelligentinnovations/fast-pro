import bcrypt from 'bcrypt';

import { UserStatus } from '../../utils/types';
import { dbClient } from '../db';
import { ADMIN_ROLE_ID, REQUESTER_ROLE_ID } from './roles';

const organizationId = '1ab2610e-b332-46f3-b43e-f740912142e1';

const UserSeed = {
  run: async () => {
    await dbClient
      .insertInto('Organization')
      .values({
        id: organizationId,
        companySize: '10-50',
        sector: 'Technology',
        name: 'SpaceX',
      })
      .execute();

    await dbClient
      .insertInto('Department')
      .values([
        {
          id: '7c260f1f-747c-4ece-a9d1-2854f6d684a3',
          name: 'Development',
          organizationId,
        },
      ])
      .execute();

    await dbClient
      .insertInto('User')
      .values([
        {
          id: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a02',
          firstname: 'Joe',
          lastname: 'Doe',
          organizationId: '1ab2610e-b332-46f3-b43e-f740912142e1',
          email: 'admin@admin.com',
          password: bcrypt.hashSync('password', 10),
          status: UserStatus.ACTIVE,
        },
        {
          id: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a03',
          firstname: 'James',
          lastname: 'Gordon',
          organizationId: '1ab2610e-b332-46f3-b43e-f740912142e1',
          email: 'james@gordon.com',
          password: bcrypt.hashSync('password', 10),
          status: UserStatus.ACTIVE,
        },
      ])
      .execute();

    await dbClient
      .insertInto('UserRole')
      .values([
        {
          userId: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a02',
          roleId: ADMIN_ROLE_ID, //assign admin role
        },
        {
          userId: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a02',
          roleId: REQUESTER_ROLE_ID, // assign requester role
        },
        {
          userId: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a03',
          roleId: REQUESTER_ROLE_ID, // assign requester role
        },
      ])
      .execute();
  },
};

export default UserSeed;
