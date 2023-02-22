/*
  Warnings:

  - The primary key for the `Webhook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `webhookId` on the `Webhook` table. All the data in the column will be lost.
  - The required column `id` was added to the `Webhook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "CreateWebhookResponse" DROP CONSTRAINT "CreateWebhookResponse_webhookId_fkey";

-- AlterTable
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_pkey",
DROP COLUMN "webhookId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CreateWebhookResponse" ADD CONSTRAINT "CreateWebhookResponse_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
