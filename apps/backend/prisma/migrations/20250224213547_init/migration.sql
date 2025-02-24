/*
  Warnings:

  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ModuleTutor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[code]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `moduleId` on the `ModuleTutor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ModuleTutor" DROP CONSTRAINT "ModuleTutor_moduleId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
ADD COLUMN     "code" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ModuleTutor" DROP CONSTRAINT "ModuleTutor_pkey",
DROP COLUMN "moduleId",
ADD COLUMN     "moduleId" INTEGER NOT NULL,
ADD CONSTRAINT "ModuleTutor_pkey" PRIMARY KEY ("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");

-- AddForeignKey
ALTER TABLE "ModuleTutor" ADD CONSTRAINT "ModuleTutor_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
