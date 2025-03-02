/*
  Warnings:

  - You are about to drop the `ReviewGroupModules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReviewGroupModules" DROP CONSTRAINT "ReviewGroupModules_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewGroupModules" DROP CONSTRAINT "ReviewGroupModules_reviewGroupId_fkey";

-- DropTable
DROP TABLE "ReviewGroupModules";

-- CreateTable
CREATE TABLE "ReviewGroupModule" (
    "reviewGroupId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "ReviewGroupModule_pkey" PRIMARY KEY ("reviewGroupId","moduleId")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "tp" INTEGER[] DEFAULT ARRAY[1, 2]::INTEGER[],
    "moduleId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "assessmentTypeId" INTEGER NOT NULL,
    "assessmentCategoryId" INTEGER NOT NULL,
    "durationInMinutes" INTEGER,
    "releaseDate" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3),

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AssessmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AssessmentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentType_name_key" ON "AssessmentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentCategory_name_key" ON "AssessmentCategory"("name");

-- AddForeignKey
ALTER TABLE "ReviewGroupModule" ADD CONSTRAINT "ReviewGroupModule_reviewGroupId_fkey" FOREIGN KEY ("reviewGroupId") REFERENCES "ReviewGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewGroupModule" ADD CONSTRAINT "ReviewGroupModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_assessmentCategoryId_fkey" FOREIGN KEY ("assessmentCategoryId") REFERENCES "AssessmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
