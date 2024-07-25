import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

@Module({
  imports: [
  ],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
