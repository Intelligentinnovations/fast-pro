import { convertAndSendResponse, zodToApi } from '@backend-template/helpers';
import {  ZodValidationPipe } from '@backend-template/http';
import { Body, Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import {
  CreateInvitePayload,
  CreateInviteSchema,
  StaffRegistrationPayload,
  StaffRegistrationSchema
} from '../utils/schema/staff';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('invite')
  @ApiOperation({summary: 'Invite staff member'})
  @ApiBody({description: 'Admin Registration', schema: zodToApi(CreateInviteSchema)})
  @ApiCreatedResponse({description: `We have sent an invite to staff email`})
  @ApiConflictResponse({description: 'A staff with the email exist'})
  @UsePipes(new ZodValidationPipe(CreateInviteSchema))
  async invite(@Body() payload: CreateInvitePayload) {
    const data = await this.staffService.invite(payload)
    return convertAndSendResponse(data)

  }

  @Post("register")
  @ApiOperation({summary: 'Invited staff registration'})
  @ApiBody({ schema: zodToApi(StaffRegistrationSchema)})
  @ApiCreatedResponse({description: `Account created successful`})
  @ApiBadRequestResponse({description: 'Invalid Otp'})
  @UsePipes(new ZodValidationPipe(StaffRegistrationSchema))
  async register(@Body() payload: StaffRegistrationPayload) {
    const data = await this.staffService.register(payload)
    return convertAndSendResponse(data)
  }

  @Delete("delete/:id")
  @ApiOperation({summary: 'Remove staff from organization'})
  @ApiOkResponse({description: 'Staff deleted successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  @ApiNotFoundResponse({description: 'Staff not found'})
  async delete( @Param('id') id: string) {
    const data = await this.staffService.delete(id)
    return convertAndSendResponse(data)
  }

  @Get("")
  @ApiOperation({summary: 'Fetch all organization staff'})
  @ApiOkResponse({description: 'Staff fetched successfully'})
  @ApiForbiddenResponse({description: 'Insufficient permission'})
  async getStaff() {
    const data = await this.staffService.fetchStaff()
    return convertAndSendResponse(data)
  }
}
