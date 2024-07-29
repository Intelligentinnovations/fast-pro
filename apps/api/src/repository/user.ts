import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import {
  DB,
  Invite,
  paginate,
  PaginationParams,
  UpdateUserPayload,
  UserData,
  UserStatus,
} from '../utils';
import {
  CreateAdminAccountPayload,
  CreateStaffAccountPayload,
  CreateVendorPayload,
} from '../utils/schema/user';

@Injectable()
export class UserRepo {
  constructor(private client: KyselyService<DB>) {}
  async createOrganization(data: CreateAdminAccountPayload) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.client.transaction().execute(async (trx) => {
      const organization = await trx
        .insertInto('Organization')
        .values({
          name: data.organizationName,
        })
        .returning(['id', 'name'])
        .executeTakeFirstOrThrow();

      const user = await trx
        .insertInto('User')
        .values({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          organizationId: organization.id,
          password: hashedPassword,
        })
        .returning(['id', 'email', 'firstname', 'lastname'])
        .executeTakeFirstOrThrow();

      const admin = await trx
        .selectFrom('Role')
        .select('id')
        .where('name', '=', 'Admin')
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('UserRole')
        .values({
          roleId: admin.id as string,
          userId: user.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const { firstname, lastname, id, email } = user;
      const { id: organizationId, name: organizationName } = organization;
      return {
        firstname,
        lastname,
        id,
        email,
        organizationId,
        organizationName,
      };
    });
  }

  async getUserByEmail(email: string) {
    return this.client
      .selectFrom('User')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }
  async getUserById(id: string) {
    return this.client
      .selectFrom('User')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async updateUserByEmail(payload: UpdateUserPayload) {
    return this.client
      .updateTable('User')
      .set({
        ...payload,
      })
      .where('email', '=', payload.email)
      .executeTakeFirstOrThrow();
  }

  async getUserAndPermissions(email: string) {
    const data = await this.client
      .selectFrom('User')
      .innerJoin('UserRole', 'User.id', 'UserRole.userId')
      .innerJoin('Role', 'UserRole.roleId', 'Role.id')
      .innerJoin('RolePermission', 'Role.id', 'RolePermission.roleId')
      .innerJoin('Permission', 'RolePermission.permissionId', 'Permission.id')
      .select([
        'User.id as userId',
        'User.firstname',
        'User.password',
        'User.lastname',
        'User.email',
        'User.organizationId',
        'User.vendorId',
        'User.status',
        'Role.id as roleId',
        'Role.name as roleName',
        'Permission.name as permissionName',
      ])
      .where('User.email', '=', email)
      .execute();

    return data.reduce((acc, row) => {
      const companyId = row.organizationId ? 'organizationId' : 'vendorId';
      if (!acc) {
        acc = {
          userId: row.userId,
          firstname: row.firstname,
          email: row.email,
          lastname: row.lastname,
          status: row.status,
          password: row.password,
          [companyId]: row.organizationId || row.vendorId,
          permissions: [],
        };
      }

      acc.permissions.push({
        name: row.permissionName,
      });

      return acc;
    }, null as unknown as UserData & { password: string });
  }

  async createStaff(
    data: CreateStaffAccountPayload & {
      email: string;
      organizationId: string;
      departmentId: string;
      hashedPassword: string;
      roleId: string;
    }
  ) {
    return this.client.transaction().execute(async (trx) => {
      const user = await trx
        .insertInto('User')
        .values({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          status: UserStatus.ACTIVE,
          departmentId: data.departmentId,
          organizationId: data.organizationId,
          password: data.hashedPassword,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('UserRole')
        .values({
          roleId: data.roleId,
          userId: user.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });
  }
  async fetchOrganizationUsers({
    organizationId,
    pagination,
    currentUserId,
  }: {
    organizationId: string;
    pagination: PaginationParams;
    currentUserId: string;
  }) {
    const queryBuilder = this.client
      .selectFrom('User')
      .leftJoin('Department', 'User.departmentId', 'Department.id')
      .innerJoin('UserRole', 'User.id', 'UserRole.userId')
      .innerJoin('Role', 'UserRole.roleId', 'Role.id')
      .select([
        'User.id',
        'firstname',
        'lastname',
        'email',
        'Department.name as department',
        'Role.name as role',
        'User.created_at as createdAt',
      ])
      .where('User.organizationId', '=', organizationId)
      .where('User.id', '!=', currentUserId)
      .where('User.isDeleted', '==', false);
    return paginate<Invite>({
      queryBuilder,
      pagination,
      identifier: 'User.id',
    });
  }

  async deleteUser({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }) {
    return this.client
      .updateTable('User')
      .set({ isDeleted: true })
      .where('id', '=', userId)
      .where('organizationId', '=', organizationId)
      .executeTakeFirstOrThrow();
  }

  async createVendor(data: CreateVendorPayload) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.client.transaction().execute(async (trx) => {
      const vendor = await trx
        .insertInto('Vendor')
        .values({
          name: data.businessName,
        })
        .returning(['id', 'name'])
        .executeTakeFirstOrThrow();

      const user = await trx
        .insertInto('User')
        .values({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          vendorId: vendor.id,
          password: hashedPassword,
        })
        .returning(['id', 'email', 'firstname', 'lastname'])
        .executeTakeFirstOrThrow();

      const vendorRole = await trx
        .selectFrom('Role')
        .select('id')
        .where('name', '=', 'Vendor')
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('UserRole')
        .values({
          roleId: vendorRole.id,
          userId: user.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const { firstname, lastname, id, email } = user;
      const { id: vendorId, name: vendorName } = vendor;
      return {
        firstname,
        lastname,
        id,
        email,
        vendorId,
        vendorName,
      };
    });
  }
}
