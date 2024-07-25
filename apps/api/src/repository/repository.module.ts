import { Global, Module } from '@nestjs/common';

import { InviteRepo } from './invite';
import { UserRepo } from './user';
import { VendorRepo } from './vendor';

@Global()
@Module({
  providers: [
    UserRepo,
    InviteRepo,
    VendorRepo

  ],
  exports: [
    InviteRepo,
    UserRepo,
    VendorRepo

  ],
})
export class RepositoryModule {}
