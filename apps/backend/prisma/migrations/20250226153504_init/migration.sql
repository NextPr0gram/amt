-- CreateTable
CREATE TABLE "ReviewGroup" (
    "id" SERIAL NOT NULL,
    "yearId" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "convenerId" INTEGER NOT NULL,

    CONSTRAINT "ReviewGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewGroupModules" (
    "reviewGroupId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "ReviewGroupModules_pkey" PRIMARY KEY ("reviewGroupId","moduleId")
);

-- AddForeignKey
ALTER TABLE "ReviewGroup" ADD CONSTRAINT "ReviewGroup_convenerId_fkey" FOREIGN KEY ("convenerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewGroupModules" ADD CONSTRAINT "ReviewGroupModules_reviewGroupId_fkey" FOREIGN KEY ("reviewGroupId") REFERENCES "ReviewGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewGroupModules" ADD CONSTRAINT "ReviewGroupModules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
