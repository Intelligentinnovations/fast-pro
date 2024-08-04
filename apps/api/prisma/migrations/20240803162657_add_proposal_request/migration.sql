-- CreateEnum
CREATE TYPE "ProposalRequestStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "ProposalRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "proposalId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "attachments" TEXT[],
    "status" "ProposalRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProposalRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalRequest" ADD CONSTRAINT "ProposalRequest_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalRequest" ADD CONSTRAINT "ProposalRequest_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
