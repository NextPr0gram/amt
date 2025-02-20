/*
  Warnings:

  - You are about to drop the `ModuleTutorAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModuleTutorAssignment" DROP CONSTRAINT "ModuleTutorAssignment_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleTutorAssignment" DROP CONSTRAINT "ModuleTutorAssignment_userId_fkey";

-- DropTable
DROP TABLE "ModuleTutorAssignment";

-- CreateTable
CREATE TABLE "ModuleTutor" (
    "userId" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "ModuleTutor_pkey" PRIMARY KEY ("userId","moduleId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "ModuleTutor" ADD CONSTRAINT "ModuleTutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleTutor" ADD CONSTRAINT "ModuleTutor_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
