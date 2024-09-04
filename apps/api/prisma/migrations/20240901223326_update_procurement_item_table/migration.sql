/*
  Warnings:

  - You are about to drop the column `procurementItemsId` on the `Procurement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Procurement" DROP COLUMN "procurementItemsId";

-- AlterTable
ALTER TABLE "ProcurementItem" ADD COLUMN     "variantId" TEXT;

-- AddForeignKey
ALTER TABLE "ProcurementItem" ADD CONSTRAINT "ProcurementItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
