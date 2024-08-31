import { Global, Module } from '@nestjs/common';

import { InviteRepo } from './invite';
import { OrganizationRepo } from './organization';
import { ProposalRepo } from './proposal';
import { ProposalRequestRepo } from './proposalRequest';
import { UserRepo } from './user';
import { VendorRepo } from './vendor';
import { TaskRepo } from './task';
import { ProductRepo } from './product';

@Global()
@Module({
  providers: [
    UserRepo,
    InviteRepo,
    VendorRepo,
    ProposalRepo,
    OrganizationRepo,
    ProposalRequestRepo,
    TaskRepo,
    ProductRepo,
  ],
  exports: [
    InviteRepo,
    UserRepo,
    VendorRepo,
    ProposalRepo,
    OrganizationRepo,
    ProposalRequestRepo,
    TaskRepo,
    ProductRepo,
  ],
})
export class RepositoryModule {}
