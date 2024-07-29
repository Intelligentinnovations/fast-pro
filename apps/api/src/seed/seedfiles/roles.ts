import { dbClient } from '../db';

const ADMIN_ROLE_ID = '559f6c03-ff5a-4fcb-bbca-cf6e7e562dcd';
const REQUESTER_ROLE_ID = '5052a4a6-93f2-40ef-94c6-0c84b81c1763';
const APPROVER_ROLE_ID = 'cb3633c1-5a15-4cef-ac60-381efdcff5ac';
const RECEIVER_ROLE_ID = '233ed840-43b7-4ba1-8a74-2618729b3d75';
const VENDOR_ROLE_ID = '10cd5e45-da73-4ffe-bb77-2b4244d2fbb4';

const CREATE_INVITE_PERMISSION_ID = '88ba5d3d-b4dd-4b6b-8580-51b166ac2534';
const VIEW_INVITE_PERMISSION_ID = 'ce7faa21-54f9-4e7e-bd50-e9393d25372a';
const DELETE_INVITE_PERMISSION_ID = 'd831a3a7-4a00-4fe4-88ab-9f89ff7294d6';

const VIEW_STAFF_PERMISSION_ID = '8edc21d8-91cc-4032-b0d4-1d221303fbca';
const DELETE_STAFF_PERMISSION_ID = 'e1e45c5e-8c2c-47b5-9bb6-58335d6da186';

const REQUEST_PURCHASE_PERMISSION_ID = 'd9abaf85-9f78-4aa2-964a-211faf64a3ea';
const APPROVE_PURCHASE_PERMISSION_ID = '6558b47e-cbca-4268-a2a2-3bc1f9c9bc6c';
const RECEIVE_PURCHASE_PERMISSION_ID = '67ac2042-348e-4bbf-9ca7-29c35536ba92';

const VIEW_PRODUCT_PERMISSION_ID = 'a1ca4748-eebb-486f-81d2-83bc0983e663';
const DELETE_PRODUCT_PERMISSION_ID = '7d90ebcb-8618-4de2-8f6d-2720c3d50142';
const UPDATE_PRODUCT_PERMISSION_ID = '22805bd2-ba9f-4e13-84eb-eeb1fe845772';
const CREATE_PRODUCT_PERMISSION_ID = 'd55be4c1-092f-469f-82ef-55a336399756';

const UPDATE_ORGANIZATION_PROFILE_PERMISSION_ID =
  'd41ec131-80f9-4495-bd7e-3a097cfd83b9';

const RolesSeed = {
  run: async () => {
    await dbClient
      .insertInto('Role')
      .values([
        {
          id: ADMIN_ROLE_ID,
          name: 'Admin',
        },
        {
          id: REQUESTER_ROLE_ID,
          name: 'Requester',
        },
        {
          id: APPROVER_ROLE_ID,
          name: 'Approver',
        },
        {
          id: RECEIVER_ROLE_ID,
          name: 'Receiver',
        },
        {
          id: VENDOR_ROLE_ID,
          name: 'Vendor',
        },
      ])
      .execute();

    await dbClient
      .insertInto('Permission')
      .values([
        // admin permissions
        {
          id: CREATE_INVITE_PERMISSION_ID,
          name: 'CREATE_INVITE',
          description: 'Can send invite',
        },
        {
          id: VIEW_INVITE_PERMISSION_ID,
          name: 'VIEW_INVITE',
          description: 'Can view invite',
        },
        {
          id: DELETE_INVITE_PERMISSION_ID,
          name: 'DELETE_INVITE',
          description: 'Can delete invite',
        },

        {
          id: VIEW_STAFF_PERMISSION_ID,
          name: 'VIEW_STAFF',
          description: 'Can view staff',
        },
        {
          id: DELETE_STAFF_PERMISSION_ID,
          name: 'DELETE_STAFF',
          description: 'Can delete staff',
        },

        {
          id: APPROVE_PURCHASE_PERMISSION_ID,
          name: 'APPROVE_PURCHASE',
          description: 'Can approve purchase request',
        },
        {
          id: RECEIVE_PURCHASE_PERMISSION_ID,
          name: 'RECEIVE_PURCHASE',
          description: 'Can receive purchase',
        },
        {
          id: REQUEST_PURCHASE_PERMISSION_ID,
          name: 'REQUEST_PURCHASE',
          description: 'Can request purchase',
        },

        {
          id: VIEW_PRODUCT_PERMISSION_ID,
          name: 'VIEW_PRODUCT',
          description: 'Can view products',
        },
        {
          id: CREATE_PRODUCT_PERMISSION_ID,
          name: 'CREATE_PRODUCT',
          description: 'Can create product',
        },
        {
          id: UPDATE_PRODUCT_PERMISSION_ID,
          name: 'UPDATE_PRODUCT',
          description: 'Can update product',
        },
        {
          id: DELETE_PRODUCT_PERMISSION_ID,
          name: 'DELETE_PRODUCT',
          description: 'Can delete product',
        },
        {
          id: UPDATE_ORGANIZATION_PROFILE_PERMISSION_ID,
          name: 'UPDATE_ORGANIZATION_PROFILE',
          description: 'Can update organization profile',
        },
      ])
      .execute();

    await dbClient
      .insertInto('RolePermission')
      .values([
        //admin permissions
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: CREATE_INVITE_PERMISSION_ID,
        },
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: VIEW_INVITE_PERMISSION_ID,
        },
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: DELETE_INVITE_PERMISSION_ID,
        },

        {
          roleId: ADMIN_ROLE_ID,
          permissionId: VIEW_STAFF_PERMISSION_ID,
        },
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: DELETE_STAFF_PERMISSION_ID,
        },
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: VIEW_PRODUCT_PERMISSION_ID,
        },
        {
          roleId: ADMIN_ROLE_ID,
          permissionId: UPDATE_ORGANIZATION_PROFILE_PERMISSION_ID,
        },

        // requester role
        {
          roleId: REQUESTER_ROLE_ID,
          permissionId: REQUEST_PURCHASE_PERMISSION_ID,
        },
        {
          roleId: REQUESTER_ROLE_ID,
          permissionId: VIEW_PRODUCT_PERMISSION_ID,
        },

        // approver role
        {
          roleId: APPROVER_ROLE_ID,
          permissionId: APPROVE_PURCHASE_PERMISSION_ID,
        },
        {
          roleId: APPROVER_ROLE_ID,
          permissionId: VIEW_PRODUCT_PERMISSION_ID,
        },

        // receiver role
        {
          roleId: RECEIVER_ROLE_ID,
          permissionId: RECEIVE_PURCHASE_PERMISSION_ID,
        },
        {
          roleId: RECEIVER_ROLE_ID,
          permissionId: VIEW_PRODUCT_PERMISSION_ID,
        },

        // vendor's permission
        {
          roleId: VENDOR_ROLE_ID,
          permissionId: CREATE_PRODUCT_PERMISSION_ID,
        },
        {
          roleId: VENDOR_ROLE_ID,
          permissionId: UPDATE_PRODUCT_PERMISSION_ID,
        },
        {
          roleId: VENDOR_ROLE_ID,
          permissionId: VIEW_PRODUCT_PERMISSION_ID,
        },
        {
          roleId: VENDOR_ROLE_ID,
          permissionId: DELETE_PRODUCT_PERMISSION_ID,
        },
      ])
      .execute();
  },
};
export default RolesSeed;
