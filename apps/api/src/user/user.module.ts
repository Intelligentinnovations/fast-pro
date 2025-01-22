import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  imports: [
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService, InviteRepo],
  exports: [UserService],
})
export class UserModule {}
