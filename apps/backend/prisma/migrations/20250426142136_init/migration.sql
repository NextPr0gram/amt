/*
  Warnings:

  - Added the required column `resitEndDate` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" ADD COLUMN     "resitEndDate" TIMESTAMP(3) NOT NULL;
