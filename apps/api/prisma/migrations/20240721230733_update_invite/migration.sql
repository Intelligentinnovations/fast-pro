-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'USED');

-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING';
