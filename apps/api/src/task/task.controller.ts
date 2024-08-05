import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Get,
  Post,
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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard, PermissionsGuard } from '../libraries/guards';
import {
  CreateTaskPayload,
  CreateTaskSchema,
  PaginationParams,
} from '../utils';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  // @RequiredPermission(Permission.CREATE_TASK)
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

  // @Put('/:id')
  // @RequiredPermission(Permission.UPDATE_TASK)
  // @ApiOperation({ summary: 'Update pending task' })
  // @ApiBody({
  //   description: 'Update invite payload',
  //   schema: zodToApi(UpdateInviteSchema),
  // })
  // @ApiOkResponse({ description: 'Invite updated successfully' })
  // @UsePipes(new ZodValidationPipe(UpdateInviteSchema))
  // async updateInvite(
  //   @Body() payload: UpdateInvitePayload,
  //   @Param('id') inviteId: string,
  //   @Request() req: FastifyRequest
  // ) {
  //   const data = await this.taskService.updateInvite({
  //     ...payload,
  //     inviteId,
  //     organizationId: req.user?.organizationId as string,
  //   });
  //   return convertAndSendResponse(data);
  // }
  //
  // @Delete('/:id')
  // @RequiredPermission(Permission.DELETE_INVITE)
  // @ApiOperation({ summary: 'Delete invite' })
  // @ApiOkResponse({ description: 'Invite deleted successfully' })
  // @ApiForbiddenResponse({ description: 'Insufficient permission' })
  // @ApiNotFoundResponse({ description: 'Invite not found' })
  // async delete(@Param('id') id: string, @Request() req: FastifyRequest) {
  //   const data = await this.taskService.delete({
  //     id,
  //     organizationId: req.user?.organizationId as string,
  //   });
  //   return convertAndSendResponse(data);
  // }
  //
  @Get('')
  // @RequiredPermission(Permission.VIEW_TASK)
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
  async getStaff(
    @Request() req: FastifyRequest,
    @Query() paginationData: PaginationParams
  ) {
    const data = await this.taskService.fetchTasks({
      organizationId: req.user?.organizationId as string,
      paginationData,
    });
    return convertAndSendResponse(data);
  }
}
