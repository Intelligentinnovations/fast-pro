-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'INACTIVE';
