/*
  Warnings:

  - You are about to drop the column `externalModerationDeadline` on the `ModerationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `finalDeadline` on the `ModerationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `internalModerationDeadline` on the `ModerationStatus` table. All the data in the column will be lost.
  - Added the required column `externalModerationDeadlineTp1` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalModerationDeadlineTp2` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalDeadlineTp1` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalDeadlineTp2` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalModerationDeadlineTp1` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalModerationDeadlineTp2` to the `ModerationStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModerationStatus" DROP COLUMN "externalModerationDeadline",
DROP COLUMN "finalDeadline",
DROP COLUMN "internalModerationDeadline",
ADD COLUMN     "externalModerationDeadlineTp1" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "externalModerationDeadlineTp2" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "finalDeadlineTp1" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "finalDeadlineTp2" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "internalModerationDeadlineTp1" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "internalModerationDeadlineTp2" TIMESTAMP(3) NOT NULL;
