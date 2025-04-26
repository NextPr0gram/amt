/*
  Warnings:

  - Added the required column `tp2EndDate` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" ADD COLUMN     "tp2EndDate" TIMESTAMP(3) NOT NULL;
