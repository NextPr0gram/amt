/*
  Warnings:

  - You are about to drop the column `tp` on the `Module` table. All the data in the column will be lost.
  - Added the required column `tpId` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TpEnum" ADD VALUE 'tp12';

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "tp",
ADD COLUMN     "tpId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_tpId_fkey" FOREIGN KEY ("tpId") REFERENCES "TP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
