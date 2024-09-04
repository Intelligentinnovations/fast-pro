-- AlterTable
ALTER TABLE "Procurement" ALTER COLUMN "status" SET DEFAULT 'created',
ALTER COLUMN "requiredDate" DROP DEFAULT;
