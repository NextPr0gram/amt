-- AlterTable
ALTER TABLE "ModerationStatus" ADD COLUMN     "erFolderId" TEXT;

-- CreateTable
CREATE TABLE "Er" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "folderId" TEXT,

    CONSTRAINT "Er_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Er_email_key" ON "Er"("email");
