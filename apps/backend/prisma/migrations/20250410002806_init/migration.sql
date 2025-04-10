/*
  Warnings:

  - You are about to drop the `ReviewGroupModule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReviewGroupModule" DROP CONSTRAINT "ReviewGroupModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewGroupModule" DROP CONSTRAINT "ReviewGroupModule_reviewGroupId_fkey";

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "reviewGroupId" INTEGER;

-- DropTable
DROP TABLE "ReviewGroupModule";

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_reviewGroupId_fkey" FOREIGN KEY ("reviewGroupId") REFERENCES "ReviewGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
