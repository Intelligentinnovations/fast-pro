import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecretsModule } from '../secrets/secrets.module';
import { UserModule } from '../user/user.module';
import { UserRepo } from '../repository';


@Module({
  imports: [
    SecretsModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepo],
  exports: [AuthService],
})
export class AuthModule {}
