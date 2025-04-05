/*
  Warnings:

  - You are about to drop the column `tp` on the `Assessment` table. All the data in the column will be lost.
  - Added the required column `tpId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "tp",
ADD COLUMN     "tpId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "TpEnum";

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_tpId_fkey" FOREIGN KEY ("tpId") REFERENCES "TP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
