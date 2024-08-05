import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { TaskRepo } from '../repository';
import { CreateTaskPayload, PaginationParams } from '../utils';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepo) {}

  async assignTask(
    payload: CreateTaskPayload & { organizationId: string; userId: string }
  ): Promise<IServiceHelper> {
    const task = await this.taskRepo.createTask(payload);
    // todo send email/notification to assignee
    // todo send reminder
    return {
      status: 'successful',
      message: 'Task created and assigned successfully',
      data: task,
    };
  }

  // async delete(payload: {
  //   organizationId: string;
  //   id: string;
  // }): Promise<IServiceHelper> {
  //   const invite = await this.taskRepo.fetchOrganizationInvite(payload);
  //   if (invite?.status === 'USED')
  //     return {
  //       status: 'forbidden',
  //       message: 'The invite has already been used by a user',
  //     };
  //   await this.taskRepo.deleteInvite(payload);
  //   return {
  //     status: 'deleted',
  //     message: 'Invite deleted successfully',
  //   };
  // }
  //
  async fetchTasks({
    organizationId,
    paginationData,
  }: {
    organizationId: string;
    paginationData: PaginationParams;
  }): Promise<IServiceHelper> {
    const tasks = await this.taskRepo.fetchTasks({
      pagination: paginationData,
      organizationId,
    });
    return {
      status: 'successful',
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }
  //
  // async updateInvite(
  //   payload: UpdateInvitePayload & { inviteId: string; organizationId: string }
  // ): Promise<IServiceHelper> {
  //   const { inviteId, organizationId, ...data } = payload;
  //   await this.taskRepo.updateInviteById({
  //     id: inviteId,
  //     organizationId,
  //     payload: data,
  //   });
  //   return {
  //     status: 'successful',
  //     message: 'Invite updated successfully',
  //   };
  // }
}
