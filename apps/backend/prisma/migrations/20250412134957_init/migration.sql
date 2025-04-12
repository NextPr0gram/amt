/*
  Warnings:

  - The primary key for the `AcademicYear` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AcademicYear` table. All the data in the column will be lost.
  - You are about to drop the column `folderid` on the `AcademicYearAssessment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcademicYearAssessment" DROP CONSTRAINT "AcademicYearAssessment_academicYearId_fkey";

-- AlterTable
ALTER TABLE "AcademicYear" DROP CONSTRAINT "AcademicYear_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("year");

-- AlterTable
ALTER TABLE "AcademicYearAssessment" DROP COLUMN "folderid",
ADD COLUMN     "folderId" INTEGER;

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("year") ON DELETE RESTRICT ON UPDATE CASCADE;
