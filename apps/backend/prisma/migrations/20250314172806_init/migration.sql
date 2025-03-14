/*
  Warnings:

  - You are about to drop the column `phaseId` on the `ModerationStatus` table. All the data in the column will be lost.
  - Added the required column `moderationPhaseId` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `TP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" DROP COLUMN "phaseId",
ADD COLUMN     "moderationPhaseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TP" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ModerationStatus" ADD CONSTRAINT "ModerationStatus_moderationPhaseId_fkey" FOREIGN KEY ("moderationPhaseId") REFERENCES "ModerationPhase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationPhase" ADD CONSTRAINT "ModerationPhase_tPId_fkey" FOREIGN KEY ("tPId") REFERENCES "TP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationPhase" ADD CONSTRAINT "ModerationPhase_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationPhase" ADD CONSTRAINT "ModerationPhase_reviewTypeId_fkey" FOREIGN KEY ("reviewTypeId") REFERENCES "ReviewType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationPhase" ADD CONSTRAINT "ModerationPhase_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "PhaseTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
