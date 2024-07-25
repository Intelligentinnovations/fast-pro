import { DefaultInterceptor } from '@backend-template/rest-server';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from "cache-manager-redis-yet";

import { AuthModule } from './auth/auth.module';
import { InviteModule } from './invite/invite.module';
import { LibrariesModule } from './libraries/libraries';
import { RepositoryModule } from './repository/repository.module';
import { SecretsModule } from './secrets/secrets.module';
import { SecretsService } from './secrets/secrets.service';
import { StaffModule } from './staff/staff.module';
import { LoggingInterceptor } from './utils/loggerInterceptor';


@Module({
  imports: [
    SecretsModule,
    LibrariesModule,
    CacheModule.registerAsync({
      useFactory: async (secrets: SecretsService) => {
        return {
          isGlobal: true,
          store: await redisStore({ url: secrets.get("REDIS_URL"), ttl: 600000 }),
        };
      },
      inject: [SecretsService],
      isGlobal: true,
    }),
    AuthModule,
    InviteModule,
    StaffModule,
    RepositoryModule,
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
