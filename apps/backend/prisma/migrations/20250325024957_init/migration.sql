/*
  Warnings:

  - You are about to drop the column `type` on the `NotificationType` table. All the data in the column will be lost.
  - Added the required column `name` to the `NotificationType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationType" DROP COLUMN "type",
ADD COLUMN     "name" TEXT NOT NULL;
