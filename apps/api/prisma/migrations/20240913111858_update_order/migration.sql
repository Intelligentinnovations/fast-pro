/*
  Warnings:

  - Added the required column `productImage` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productImage" TEXT NOT NULL,
ADD COLUMN     "vendorName" TEXT NOT NULL;
