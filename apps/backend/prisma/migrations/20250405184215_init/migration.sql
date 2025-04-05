/*
  Warnings:

  - You are about to drop the column `releaseDate` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "releaseDate",
DROP COLUMN "submissionDate";

-- CreateTable
CREATE TABLE "AcademicYearAssessment" (
    "id" SERIAL NOT NULL,
    "tpId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "assessmentTypeId" INTEGER NOT NULL,
    "assessmentCategoryId" INTEGER NOT NULL,
    "durationInMinutes" INTEGER,
    "releaseDate" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3),

    CONSTRAINT "AcademicYearAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_tpId_fkey" FOREIGN KEY ("tpId") REFERENCES "TP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYearAssessment" ADD CONSTRAINT "AcademicYearAssessment_assessmentCategoryId_fkey" FOREIGN KEY ("assessmentCategoryId") REFERENCES "AssessmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
