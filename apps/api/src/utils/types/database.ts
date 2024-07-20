import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserStatus = {
  UNVERIFIED: 'UNVERIFIED',
  ACTIVE: 'ACTIVE',
  DEACTIVATED: 'DEACTIVATED',
  DELETED: 'DELETED',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export type Organization = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Permission = {
  id: Generated<string>;
  name: string;
  description: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Role = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type RolePermission = {
  roleId: string;
  permissionId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type User = {
  id: Generated<string>;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  status: Generated<UserStatus>;
  organizationId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type UserRole = {
  userId: string;
  roleId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type DB = {
  Organization: Organization;
  Permission: Permission;
  Role: Role;
  RolePermission: RolePermission;
  User: User;
  UserRole: UserRole;
};
