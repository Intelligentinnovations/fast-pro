import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
  ],
  controllers: [StaffController],
  providers: [StaffService, InviteRepo],
  exports: [StaffService],
})
export class StaffModule {}
