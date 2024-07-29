import { Global, Module } from '@nestjs/common';

import { InviteRepo } from './invite';
import { UserRepo } from './user';
import { VendorRepo } from './vendor';
import { OrganizationRepo } from './organization';

@Global()
@Module({
  providers: [UserRepo, InviteRepo, VendorRepo, OrganizationRepo],
  exports: [InviteRepo, UserRepo, VendorRepo, OrganizationRepo],
})
export class RepositoryModule {}
