import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import { UserController } from './user.controller';
import { UserService } from './user.service';



@Module({
  imports: [
  ],
  controllers: [UserController],
  providers: [UserService, InviteRepo],
  exports: [UserService],
})
export class UserModule {}
