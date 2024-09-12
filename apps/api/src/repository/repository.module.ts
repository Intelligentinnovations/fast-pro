import { Global, Module } from '@nestjs/common';

import { CartRepository } from './cart';
import { InviteRepo } from './invite';
import { OrderRepository } from './order';
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
    ProcurementItemRepo,
    OrderRepository,
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
    ProcurementItemRepo,
    OrderRepository,
  ],
})
export class RepositoryModule {}
