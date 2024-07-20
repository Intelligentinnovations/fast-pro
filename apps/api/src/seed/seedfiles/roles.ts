import { dbClient } from '../db';


const RolesSeed = {
  run: async () => {
    await dbClient
      .insertInto('Role')
      .values([
        {
        id: '559f6c03-ff5a-4fcb-bbca-cf6e7e562dcd',
        name: 'Admin'
        },
        {
          id: '5052a4a6-93f2-40ef-94c6-0c84b81c1763',
          name: 'Requester'
        },
        {
          id: 'cb3633c1-5a15-4cef-ac60-381efdcff5ac',
          name: 'Approver'
        },
        {
          id: '233ed840-43b7-4ba1-8a74-2618729b3d75',
          name: 'Receiver'
        } ,
        {
          id: '10cd5e45-da73-4ffe-bb77-2b4244d2fbb4',
          name: 'Vendor'
        }
      ]).execute();

    await dbClient
      .insertInto('Permission')
      .values([
        {
          id: '88ba5d3d-b4dd-4b6b-8580-51b166ac2534',
          name: 'Manage users',
          description: 'Can manage any user related task'
        },
        {
          id: '58d10def-ece4-46e5-a245-0518278f918f',
          name: 'Make Request',
          description: 'Can make purchase request',
        },
        {
          id: '6558b47e-cbca-4268-a2a2-3bc1f9c9bc6c',
          name: 'Approve Purchase request',
          description: 'Can approve purchase request'
        },
        {
          id: '67ac2042-348e-4bbf-9ca7-29c35536ba92',
          name: 'Receive Purchases',
          description: 'Receive Purchase'
        } ,
        {
          id: 'a1ca4748-eebb-486f-81d2-83bc0983e663',
          name: 'Manage product',
          description: 'Create, read, update, delete Products'
        }
      ])
      .execute();

    await dbClient
      .insertInto('RolePermission')
      .values([
        {
          roleId: '559f6c03-ff5a-4fcb-bbca-cf6e7e562dcd',
          permissionId: '88ba5d3d-b4dd-4b6b-8580-51b166ac2534',
        },
        {
          roleId: '5052a4a6-93f2-40ef-94c6-0c84b81c1763',
          permissionId: '58d10def-ece4-46e5-a245-0518278f918f',
        },
        {
          roleId: 'cb3633c1-5a15-4cef-ac60-381efdcff5ac',
          permissionId: '6558b47e-cbca-4268-a2a2-3bc1f9c9bc6c',
        },
        {
          roleId: '233ed840-43b7-4ba1-8a74-2618729b3d75',
          permissionId: '67ac2042-348e-4bbf-9ca7-29c35536ba92'
        },
        {
          roleId: '10cd5e45-da73-4ffe-bb77-2b4244d2fbb4',
          permissionId: 'a1ca4748-eebb-486f-81d2-83bc0983e663'
        }
      ])
      .execute();

  }
}
export default RolesSeed;
