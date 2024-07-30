/*
  Warnings:

  - The `status` column on the `Proposal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "status",
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'OPEN';
