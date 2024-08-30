/*
  Warnings:

  - You are about to drop the column `specTitle` on the `ProductSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `specValue` on the `ProductSpecification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProductSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProductSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `ProductSpecification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductSpecification" DROP COLUMN "specTitle",
DROP COLUMN "specValue",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
