-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "sector" DROP NOT NULL,
ALTER COLUMN "taxIdentification" DROP NOT NULL,
ALTER COLUMN "businessRegistrationNumber" DROP NOT NULL;
