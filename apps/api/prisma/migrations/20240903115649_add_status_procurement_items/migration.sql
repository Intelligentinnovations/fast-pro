-- CreateEnum
CREATE TYPE "ProcurementItemStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "ProcurementItem" ADD COLUMN     "status" "ProcurementItemStatus" NOT NULL DEFAULT 'pending';
