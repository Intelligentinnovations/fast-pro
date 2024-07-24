import { InviteStatus } from './database';

export interface UpdateInvitePayload {
  roleId?:  string
  departmentId?: string
  status?: InviteStatus
}
