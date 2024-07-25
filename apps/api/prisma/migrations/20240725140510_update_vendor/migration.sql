/*
  Warnings:

  - You are about to drop the column `taxIdentification` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "taxIdentification",
ADD COLUMN     "taxIdentificationNumber" TEXT;
