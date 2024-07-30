/*
  Warnings:

  - You are about to drop the column `additionaDocument` on the `Proposal` table. All the data in the column will be lost.
  - Added the required column `additionalDocument` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "additionaDocument",
ADD COLUMN     "additionalDocument" TEXT NOT NULL;
