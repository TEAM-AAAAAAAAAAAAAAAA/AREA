/*
  Warnings:

  - You are about to drop the column `serviceName` on the `Webhook` table. All the data in the column will be lost.
  - Added the required column `incomingServiceName` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_serviceName_fkey";

-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "serviceName",
ADD COLUMN     "incomingServiceName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_incomingServiceName_fkey" FOREIGN KEY ("incomingServiceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;
