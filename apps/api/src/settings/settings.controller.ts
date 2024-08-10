import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import { ZodValidationPipe } from '@backend-template/http';
import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import {
  AuthGuard,
  PermissionsGuard,
  RequiredPermission,
} from '../libraries/guards';
import {
  ChangePasswordPayload,
  ChangePasswordSchema,
  DeleteAccountPayload,
  Permission,
} from '../utils';
import { SettingsService } from './settings.service';

@ApiBearerAuth()
@ApiTags('Settings')
@UseGuards(AuthGuard)
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

  @Delete('delete-account')
  @UseGuards(PermissionsGuard)
  @RequiredPermission(Permission.DELETE_ACCOUNT)
  @ApiOperation({ summary: 'Delete organization account staff' })
  @ApiOkResponse({ description: 'account deleted successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permission' })
  async deleteOrganizationAccount(
    @Request() req: FastifyRequest,
    @Body() payload: DeleteAccountPayload
  ) {
    const data = await this.settingsService.deleteOrganizationAccount(
      req.user?.organizationId as string
    );
    return convertAndSendResponse(data);
  }
}
