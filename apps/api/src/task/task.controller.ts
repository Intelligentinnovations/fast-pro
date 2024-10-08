import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import {
  AuthGuard,
  PermissionsGuard,
  RequiredPermission,
} from '../libraries/guards';
import {
  CreateTaskPayload,
  CreateTaskSchema,
  Permission,
  QueryParams,
  UpdateTaskPayload,
  UpdateTaskSchema,
} from '../utils';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @RequiredPermission(Permission.CREATE_TASK)
  @ApiOperation({ summary: 'Assign task to a staff member' })
  @ApiBody({
    description: 'Create and assign task payload',
    schema: zodToApi(CreateTaskSchema),
  })
  @ApiCreatedResponse({ description: `Task created successfully` })
  @ApiConflictResponse({
    description: 'A pending task with the same name exist',
  })
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  async assignTask(
    @Body() payload: CreateTaskPayload,
    @Request() req: FastifyRequest
  ) {
    const data = await this.taskService.assignTask({
      ...payload,
      userId: req.user?.userId as string,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Put(':id')
  @RequiredPermission(Permission.UPDATE_TASK)
  @ApiOperation({ summary: 'Update pending task' })
  @ApiBody({
    description: 'Update task payload',
    schema: zodToApi(UpdateTaskSchema),
  })
  @ApiOkResponse({ description: 'Task updated successfully' })
  async updateTask(
    @Param('id') taskId: string,
    @Request() req: FastifyRequest,
    @Body(new ZodValidationPipe(UpdateTaskSchema)) payload: UpdateTaskPayload
  ) {
    const data = await this.taskService.updateTask({
      ...payload,
      taskId,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Delete('/:id')
  @RequiredPermission(Permission.DELETE_TASK)
  @ApiOperation({ summary: 'Delete task' })
  @ApiOkResponse({ description: 'Task deleted successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async delete(@Param('id') id: string, @Request() req: FastifyRequest) {
    const data = await this.taskService.delete({
      id,
      organizationId: req.user?.organizationId as string,
    });
    return convertAndSendResponse(data);
  }

  @Get('')
  @RequiredPermission(Permission.VIEW_TASK)
  @ApiOperation({ summary: 'Fetch all organization tasks' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOkResponse({ description: 'Tasks fetched successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  async getTask(
    @Request() req: FastifyRequest,
    @Query() paginationData: QueryParams
  ) {
    const data = await this.taskService.fetchTasks({
      organizationId: req.user?.organizationId as string,
      paginationData,
    });
    return convertAndSendResponse(data);
  }
}
