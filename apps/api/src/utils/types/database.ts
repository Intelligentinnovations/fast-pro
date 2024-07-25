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
export const InviteStatus = {
  PENDING: 'PENDING',
  USED: 'USED',
} as const;
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];
export type Department = {
  id: Generated<string>;
  organizationId: string;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Invite = {
  id: Generated<string>;
  organizationId: string;
  email: string;
  roleId: string;
  departmentId: string;
  status: Generated<InviteStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Organization = {
  id: Generated<string>;
  name: string;
  companySize: string;
  sector: string;
  logo: string | null;
  companyId: string | null;
  description: string | null;
  websiteUrl: string | null;
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
  departmentId: string | null;
  isDeleted: Generated<boolean>;
  profileImage: string | null;
  title: string | null;
  biography: string | null;
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
  Department: Department;
  Invite: Invite;
  Organization: Organization;
  Permission: Permission;
  Role: Role;
  RolePermission: RolePermission;
  User: User;
  UserRole: UserRole;
};
