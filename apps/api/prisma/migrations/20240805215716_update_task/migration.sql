/*
  Warnings:

  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_vendorId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "userId",
DROP COLUMN "vendorId",
ADD COLUMN     "priority" TEXT NOT NULL;
