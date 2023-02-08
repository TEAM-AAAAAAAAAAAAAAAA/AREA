/*
  Warnings:

  - You are about to drop the `CreateWebhook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreateWebhook" DROP CONSTRAINT "CreateWebhook_webhookId_fkey";

-- DropTable
DROP TABLE "CreateWebhook";

-- CreateTable
CREATE TABLE "CreateWebhookResponse" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "webhookId" TEXT,

    CONSTRAINT "CreateWebhookResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreateWebhookResponse" ADD CONSTRAINT "CreateWebhookResponse_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("webhookId") ON DELETE SET NULL ON UPDATE CASCADE;
