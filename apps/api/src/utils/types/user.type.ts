import { UserStatus } from './database';

export interface UpdateUserPayload {
  lastname?: string;
  firstname?: string;
  email: string;
  status?: UserStatus;
  password?: string;
}

export interface UserData  {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  organizationId: string;
  permissions: {
    name: string
  }[]
}
