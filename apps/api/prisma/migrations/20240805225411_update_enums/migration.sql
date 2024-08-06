/*
  Warnings:

  - The values [PENDING,USED] on the enum `InviteStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUBMITTED,ACCEPTED,REJECTED] on the enum `ProposalRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN,CLOSED] on the enum `ProposalStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [TODO,IN_PROGRESS,COMPLETED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNVERIFIED,ACTIVE,DEACTIVATED,DELETED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [INACTIVE,ACTIVE,DEACTIVATED] on the enum `VendorStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InviteStatus_new" AS ENUM ('pending', 'used');
ALTER TABLE "Invite" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Invite" ALTER COLUMN "status" TYPE "InviteStatus_new" USING ("status"::text::"InviteStatus_new");
ALTER TYPE "InviteStatus" RENAME TO "InviteStatus_old";
ALTER TYPE "InviteStatus_new" RENAME TO "InviteStatus";
DROP TYPE "InviteStatus_old";
ALTER TABLE "Invite" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProposalRequestStatus_new" AS ENUM ('submitted', 'accepted', 'rejected');
ALTER TABLE "ProposalRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProposalRequest" ALTER COLUMN "status" TYPE "ProposalRequestStatus_new" USING ("status"::text::"ProposalRequestStatus_new");
ALTER TYPE "ProposalRequestStatus" RENAME TO "ProposalRequestStatus_old";
ALTER TYPE "ProposalRequestStatus_new" RENAME TO "ProposalRequestStatus";
DROP TYPE "ProposalRequestStatus_old";
ALTER TABLE "ProposalRequest" ALTER COLUMN "status" SET DEFAULT 'submitted';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProposalStatus_new" AS ENUM ('open', 'closed');
ALTER TABLE "Proposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Proposal" ALTER COLUMN "status" TYPE "ProposalStatus_new" USING ("status"::text::"ProposalStatus_new");
ALTER TYPE "ProposalStatus" RENAME TO "ProposalStatus_old";
ALTER TYPE "ProposalStatus_new" RENAME TO "ProposalStatus";
DROP TYPE "ProposalStatus_old";
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'open';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('todo', 'inProgres', 'completed');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'todo';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('unverified', 'active', 'deactivated', 'deleted');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'unverified';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VendorStatus_new" AS ENUM ('inactive', 'active', 'deactivated');
ALTER TABLE "Vendor" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Vendor" ALTER COLUMN "status" TYPE "VendorStatus_new" USING ("status"::text::"VendorStatus_new");
ALTER TYPE "VendorStatus" RENAME TO "VendorStatus_old";
ALTER TYPE "VendorStatus_new" RENAME TO "VendorStatus";
DROP TYPE "VendorStatus_old";
ALTER TABLE "Vendor" ALTER COLUMN "status" SET DEFAULT 'inactive';
COMMIT;

-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "ProposalRequest" ALTER COLUMN "status" SET DEFAULT 'submitted';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'todo';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'unverified';

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "status" SET DEFAULT 'inactive';
