import { Global, Module } from '@nestjs/common';

import { InviteRepo } from './invite';
import { OrganizationRepo } from './organization';
import { ProposalRepo } from './proposal';
import { UserRepo } from './user';
import { VendorRepo } from './vendor';

@Global()
@Module({
  providers: [UserRepo, InviteRepo, VendorRepo, ProposalRepo, OrganizationRepo],
  exports: [InviteRepo, UserRepo, VendorRepo, ProposalRepo, OrganizationRepo],
})
export class RepositoryModule {}
