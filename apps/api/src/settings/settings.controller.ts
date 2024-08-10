import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthGuard } from '../libraries/guards';
import { ChangePasswordPayload, ChangePasswordSchema } from '../utils';
import { SettingsService } from './settings.service';

@UseGuards(AuthGuard)
@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    description: 'Change user password payload',
    schema: zodToApi(ChangePasswordSchema),
  })
  @ApiOkResponse({ description: `Password updated successful` })
  @ApiForbiddenResponse({ description: `Incorrect password` })
  @UsePipes(new ZodValidationPipe(ChangePasswordSchema))
  async changePassword(
    @Request() req: FastifyRequest,
    @Body() payload: ChangePasswordPayload
  ) {
    const data = await this.settingsService.changePassword({
      ...payload,
      email: req.user?.email as string,
    });
    return convertAndSendResponse(data);
  }

  //   @Get('')
  //   @ApiBearerAuth()
  //   @RequiredPermission(Permission.VIEW_STAFF)
  //   @ApiOperation({ summary: 'Fetch all staff' })
  //   @ApiQuery({
  //     name: 'page',
  //     required: false,
  //     type: Number,
  //     description: 'Page number',
  //   })
  //   @ApiQuery({
  //     name: 'limit',
  //     required: false,
  //     type: Number,
  //     description: 'Number of items per page',
  //   })
  //   @ApiOkResponse({ description: 'Staff fetched successfully' })
  //   @ApiForbiddenResponse({ description: 'Insufficient permission' })
  //   async getStaff(
  //     @Request() req: FastifyRequest,
  //     @Query() paginationData: PaginationParams
  //   ) {
  //     const data = await this.settingsService.fetchStaff({
  //       organizationId: req.user?.organizationId as string,
  //       paginationData,
  //       currentUserId: req.user?.userId as string,
  //     });
  //     return convertAndSendResponse(data);
  //   }
  //
  //   @Delete(':id')
  //   @ApiBearerAuth()
  //   @UseGuards(AuthGuard, PermissionsGuard)
  //   @RequiredPermission(Permission.DELETE_STAFF)
  //   @ApiOperation({ summary: 'Delete a staff' })
  //   @ApiOkResponse({ description: 'staff deleted successfully' })
  //   @ApiForbiddenResponse({ description: 'Insufficient permission' })
  //   async delete(@Param('id') id: string, @Request() req: FastifyRequest) {
  //     const data = await this.settingsService.delete({
  //       id,
  //       organizationId: req.user?.organizationId as string,
  //     });
  //     return convertAndSendResponse(data);
  //   }
}
