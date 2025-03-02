/*
  Warnings:

  - The `tp` column on the `Assessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TpEnum" AS ENUM ('tp1', 'tp2');

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "tp",
ADD COLUMN     "tp" "TpEnum" NOT NULL DEFAULT 'tp1';
