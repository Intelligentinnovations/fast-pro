import { Module } from '@nestjs/common';

import { InviteRepo } from '../repository/invite';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';



@Module({
  imports: [
  ],
  controllers: [AuthController],
  providers: [AuthService, InviteRepo],
  exports: [AuthService],
})
export class AuthModule {}
