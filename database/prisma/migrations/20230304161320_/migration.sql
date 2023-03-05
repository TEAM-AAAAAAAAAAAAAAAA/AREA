/*
  Warnings:

  - A unique constraint covering the columns `[webhookId]` on the table `ActionWebhook` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceName,actionName,userId]` on the table `ActionWebhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ActionWebhook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActionWebhook" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActionWebhook_webhookId_key" ON "ActionWebhook"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionWebhook_serviceName_actionName_userId_key" ON "ActionWebhook"("serviceName", "actionName", "userId");

-- AddForeignKey
ALTER TABLE "ActionWebhook" ADD CONSTRAINT "ActionWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
