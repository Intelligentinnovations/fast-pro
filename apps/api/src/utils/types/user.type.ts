import { UserStatus } from './database';

export interface UpdateUserPayload {
  lastname?: string;
  firstname?: string;
  email: string;
  status?: UserStatus;
}

export interface UserWithPermissions {
  userId: string;
  firstname: string;
  lastname: string;
  status: string;
  password: string;
  organizationId: string;
  permissions: {
    permissionId: string;
    permissionName: string;
  }[] ;
}
