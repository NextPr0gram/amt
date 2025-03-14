/*
  Warnings:

  - You are about to drop the `Phase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Phase";

-- CreateTable
CREATE TABLE "ModerationPhase" (
    "id" SERIAL NOT NULL,
    "tPId" INTEGER NOT NULL,
    "stageId" INTEGER NOT NULL,
    "reviewTypeId" INTEGER NOT NULL,
    "triggerId" INTEGER NOT NULL,

    CONSTRAINT "ModerationPhase_pkey" PRIMARY KEY ("id")
);
