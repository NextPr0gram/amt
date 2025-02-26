-- AddForeignKey
ALTER TABLE "ReviewGroup" ADD CONSTRAINT "ReviewGroup_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
