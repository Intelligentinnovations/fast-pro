import { Module } from '@nestjs/common';
import { ProposalRequestController } from './proposalRequest.controller';
import { ProposalRequestService } from './proposalRequest.service';

@Module({
  imports: [],
  controllers: [ProposalRequestController],
  providers: [ProposalRequestService],
  exports: [ProposalRequestService],
})
export class ProposalRequestModule {}
