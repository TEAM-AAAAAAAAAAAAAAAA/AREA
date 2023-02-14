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
