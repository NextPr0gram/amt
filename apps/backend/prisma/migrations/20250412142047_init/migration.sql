/*
  Warnings:

  - The primary key for the `AcademicYear` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[year]` on the table `AcademicYear` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AcademicYearAssessment" DROP CONSTRAINT "AcademicYearAssessment_academicYearId_fkey";

-- AlterTable
ALTER TABLE "AcademicYear" DROP CONSTRAINT "AcademicYear_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_year_key" ON "AcademicYear"("year");

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
