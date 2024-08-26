import { DefaultInterceptor } from '@backend-template/rest-server';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';

import { AuthModule } from './auth/auth.module';
import { InviteModule } from './invite/invite.module';
import { LibrariesModule } from './libraries/libraries';
import { ProposalModule } from './proposal/proposal.module';
import { ProposalRequestModule } from './proposalRequest/proposalRequest.module';
import { RepositoryModule } from './repository/repository.module';
import { SecretsModule } from './secrets/secrets.module';
import { SecretsService } from './secrets/secrets.service';
import { SettingsModule } from './settings/settings.module';
import { StaffModule } from './staff/staff.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { LoggingInterceptor } from './utils/loggerInterceptor';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    SecretsModule,
    LibrariesModule,
    CacheModule.registerAsync({
      useFactory: async (secrets: SecretsService) => {
        return {
          isGlobal: true,
          store: await redisStore({
            url: secrets.get('REDIS_URL'),
            ttl: 600000,
          }),
        };
      },
      inject: [SecretsService],
      isGlobal: true,
    }),
    AuthModule,
    InviteModule,
    StaffModule,
    UserModule,
    ProposalModule,
    ProposalRequestModule,
    RepositoryModule,
    TaskModule,
    SettingsModule,
    ProfileModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
