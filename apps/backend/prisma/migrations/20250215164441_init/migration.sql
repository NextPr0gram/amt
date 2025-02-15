/*
  Warnings:

  - Added the required column `year` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "moduleLeadId" INTEGER,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';

-- CreateTable
CREATE TABLE "ModuleTutorAssignment" (
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "ModuleTutorAssignment_pkey" PRIMARY KEY ("userId","moduleId")
);

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_moduleLeadId_fkey" FOREIGN KEY ("moduleLeadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleTutorAssignment" ADD CONSTRAINT "ModuleTutorAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleTutorAssignment" ADD CONSTRAINT "ModuleTutorAssignment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
