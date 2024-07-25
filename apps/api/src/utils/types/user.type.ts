import { UserStatus } from './database';

export interface UpdateUserPayload {
  lastname?: string;
  firstname?: string;
  email: string;
  isDeleted?: boolean
  status?: UserStatus;
  password?: string;
  profileImage?: string;
  title?:string
  biography?:string
  phoneNumber?:string
  address?:string
}

export interface UserData  {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  role: string;
  organizationId: string;
  permissions: {
    name: string
  }[]
}
