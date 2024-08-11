import { UserStatus } from './database';

export interface UpdateUserPayload {
  lastname?: string;
  firstname?: string;
  isDeleted?: boolean;
  status?: UserStatus;
  password?: string;
  profileImage?: string;
  title?: string;
  biography?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserData {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  organizationId?: string;
  vendorId?: string;
  permissions: {
    name: string;
  }[];
}
