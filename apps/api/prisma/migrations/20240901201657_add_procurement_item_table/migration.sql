/*
  Warnings:

  - You are about to drop the column `productId` on the `Procurement` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Procurement` table. All the data in the column will be lost.
  - Added the required column `procurementItemsId` to the `Procurement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Procurement" DROP CONSTRAINT "Procurement_productId_fkey";

-- DropForeignKey
ALTER TABLE "Procurement" DROP CONSTRAINT "Procurement_variantId_fkey";

-- AlterTable
ALTER TABLE "Procurement" DROP COLUMN "productId",
DROP COLUMN "variantId",
ADD COLUMN     "procurementItemsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProcurementItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "procurementId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProcurementItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProcurementItem" ADD CONSTRAINT "ProcurementItem_procurementId_fkey" FOREIGN KEY ("procurementId") REFERENCES "Procurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementItem" ADD CONSTRAINT "ProcurementItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
