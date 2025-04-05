/*
  Warnings:

  - You are about to drop the column `tpId` on the `Module` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_tpId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "tpId";

-- CreateTable
CREATE TABLE "ModuleTP" (
    "moduleId" INTEGER NOT NULL,
    "tpId" INTEGER NOT NULL,

    CONSTRAINT "ModuleTP_pkey" PRIMARY KEY ("moduleId","tpId")
);

-- AddForeignKey
ALTER TABLE "ModuleTP" ADD CONSTRAINT "ModuleTP_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleTP" ADD CONSTRAINT "ModuleTP_tpId_fkey" FOREIGN KEY ("tpId") REFERENCES "TP"("id") ON DELETE CASCADE ON UPDATE CASCADE;
