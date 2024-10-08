import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { UserStatus } from '../../utils';
import { dbClient } from '../db';
import { ADMIN_ROLE_ID, REQUESTER_ROLE_ID, VENDOR_ROLE_ID } from './roles';

const organizationId = '1ab2610e-b332-46f3-b43e-f740912142e1';
const vendorId = 'd8daaf29-c35d-420d-8026-b8bfbe4e1c3c';
const vendorId2 = 'd8daaf29-c35d-420d-8026-b8bfbe4e1c37';
const vendorUserId = randomUUID();
const vendorUserId2 = randomUUID();

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
      .insertInto('Vendor')
      .values([
        {
          id: vendorId,
          name: 'Big Tech Devices',
          status: 'active',
        },
        {
          id: vendorId2,
          name: 'Apple Store',
          status: 'active',
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
          status: UserStatus.active,
        },
        {
          id: '8a93a86b-6f2b-4b17-b6d6-bdc5ca041a03',
          firstname: 'James',
          lastname: 'Gordon',
          organizationId: '1ab2610e-b332-46f3-b43e-f740912142e1',
          email: 'james@gordon.com',
          password: bcrypt.hashSync('password', 10),
          status: UserStatus.active,
        },
        {
          id: vendorUserId,
          firstname: 'Ira',
          lastname: 'Gaines',
          vendorId: vendorId,
          email: 'ira@gaines.com',
          password: bcrypt.hashSync('password', 10),
          status: UserStatus.active,
        },
        {
          id: vendorUserId2,
          firstname: 'Sarah',
          lastname: 'Johnson',
          vendorId: vendorId2,
          email: 'sarah@johnson.com',
          password: bcrypt.hashSync('password', 10),
          status: UserStatus.active,
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
        {
          userId: vendorUserId,
          roleId: VENDOR_ROLE_ID, // assign vendor role
        },
        {
          userId: vendorUserId2,
          roleId: VENDOR_ROLE_ID, // assign vendor role
        },
      ])
      .execute();
  },
};

export default UserSeed;
