/*
  Warnings:

  - You are about to drop the column `year` on the `Module` table. All the data in the column will be lost.
  - Added the required column `yearId` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "year",
ADD COLUMN     "yearId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Year" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
