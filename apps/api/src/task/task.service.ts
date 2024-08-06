import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { TaskRepo } from '../repository';
import {
  CreateTaskPayload,
  PaginationParams,
  UpdateTaskPayload,
} from '../utils';

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

  async delete(payload: {
    organizationId: string;
    id: string;
  }): Promise<IServiceHelper> {
    await this.taskRepo.deleteTask(payload);
    return {
      status: 'deleted',
      message: 'Task deleted successfully',
    };
  }

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

  async updateTask(
    payload: UpdateTaskPayload & { taskId: string; organizationId: string }
  ): Promise<IServiceHelper> {
    const { taskId, organizationId, ...data } = payload;
    const task = await this.taskRepo.fetchTaskById(taskId);
    if (!task) return { status: 'not-found', message: 'No task found' };
    if (task.status !== 'todo')
      return {
        status: 'forbidden',
        message: 'Task already in progress or completed',
      };
    await this.taskRepo.updateTaskById(payload);
    return {
      status: 'successful',
      message: 'Invite updated successfully',
    };
  }
}
