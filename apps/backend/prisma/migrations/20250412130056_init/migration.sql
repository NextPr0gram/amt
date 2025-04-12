/*
  Warnings:

  - Added the required column `academicYearId` to the `AcademicYearAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicYearAssessment" ADD COLUMN     "academicYearId" INTEGER NOT NULL,
ADD COLUMN     "folderid" INTEGER;

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
