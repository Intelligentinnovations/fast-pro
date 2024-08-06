import { KyselyService } from '@backend-template/database';
import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import {
  CreateTaskPayload,
  DB,
  paginate,
  PaginationParams,
  UpdateTaskPayload,
} from '../utils';

@Injectable()
export class TaskRepo {
  constructor(private client: KyselyService<DB>) {}

  async createTask(
    payload: CreateTaskPayload & { userId: string; organizationId: string }
  ) {
    const { userId, ...rest } = payload;
    return this.client
      .insertInto('Task')
      .values({ ...rest, assignerId: userId })
      .returning(['id', 'assigneeId'])
      .execute();
  }

  async fetchTasks(payload: {
    organizationId: string;
    pagination: PaginationParams;
  }) {
    const { pagination, organizationId } = payload;
    const queryBuilder = this.client
      .selectFrom('Task')
      .innerJoin('User as Assignee', 'Task.assigneeId', 'Assignee.id')
      .innerJoin('User as Assigner', 'Task.assignerId', 'Assigner.id')
      .where('Task.organizationId', '=', organizationId)
      .select([
        'Task.id',
        'Task.title',
        'Task.status',
        'Task.priority',
        sql`${sql.ref('Assignee.firstname')} || ' ' || ${sql.ref(
          'Assignee.lastname'
        )}`.as('assigneeFullName'),
        sql`${sql.ref('Assigner.firstname')} || ' ' || ${sql.ref(
          'Assigner.lastname'
        )}`.as('assignerFullName'),
      ]);

    return paginate({ queryBuilder, pagination, identifier: 'Task.id' });
  }

  async deleteTask(payload: { organizationId: string; id: string }) {
    return await this.client
      .deleteFrom('Task')
      .where('id', '=', payload.id)
      .where('id', '=', payload.organizationId)
      .where('status', '=', 'todo')
      .executeTakeFirst();
  }

  async updateTaskById(
    payload: UpdateTaskPayload & { taskId: string; organizationId: string }
  ) {
    return await this.client
      .updateTable('Task')
      .set(payload)
      .where('id', '=', payload.taskId)
      .where('organizationId', '=', payload.organizationId)
      .executeTakeFirst();
  }

  async fetchTaskById(taskId: string) {
    return await this.client
      .selectFrom('Task')
      .where('id', '=', taskId)
      .selectAll()
      .executeTakeFirst();
  }
}
