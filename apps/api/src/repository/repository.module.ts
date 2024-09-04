import { Global, Module } from '@nestjs/common';

import { CartRepository } from './cart';
import { InviteRepo } from './invite';
import { OrganizationRepo } from './organization';
import { ProcurementRepo } from './procurement';
import { ProcurementItemRepo } from './procurementItems';
import { ProductRepo } from './product';
import { ProposalRepo } from './proposal';
import { ProposalRequestRepo } from './proposalRequest';
import { TaskRepo } from './task';
import { UserRepo } from './user';
import { VendorRepo } from './vendor';

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
    CartRepository,
    ProcurementRepo,
    ProcurementItemRepo
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
    CartRepository,
    ProcurementRepo,
    ProcurementItemRepo
  ],
})
export class RepositoryModule {}
