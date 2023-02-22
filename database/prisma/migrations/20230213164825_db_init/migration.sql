/*
  Warnings:

  - A unique constraint covering the columns `[webhookId]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Webhook_webhookId_key" ON "Webhook"("webhookId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;
