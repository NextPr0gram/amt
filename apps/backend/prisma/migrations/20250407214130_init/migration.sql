/*
  Warnings:

  - Added the required column `externalModerationDeadline` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalDeadline` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalModerationDeadline` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" ADD COLUMN     "externalModerationDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "finalDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "internalModerationDeadline" TIMESTAMP(3) NOT NULL;
