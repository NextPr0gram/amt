/*
  Warnings:

  - Added the required column `tp1StartDate` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tp2StartDate` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" ADD COLUMN     "tp1DeadlinesSet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tp1StartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tp2DeadlinesSet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tp2StartDate" TIMESTAMP(3) NOT NULL;
