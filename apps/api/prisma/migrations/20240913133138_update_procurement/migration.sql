/*
  Warnings:

  - Added the required column `productImage` to the `ProcurementItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `ProcurementItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorName` to the `ProcurementItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProcurementItem" ADD COLUMN     "productImage" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "vendorName" TEXT NOT NULL;
