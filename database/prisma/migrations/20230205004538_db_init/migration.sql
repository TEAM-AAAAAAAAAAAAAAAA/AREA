/*
  Warnings:

  - Added the required column `serviceId` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webhook" ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
