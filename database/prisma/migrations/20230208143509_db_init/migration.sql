-- CreateTable
CREATE TABLE "CreateWebhook" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "webhookId" TEXT,

    CONSTRAINT "CreateWebhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreateWebhook" ADD CONSTRAINT "CreateWebhook_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("webhookId") ON DELETE SET NULL ON UPDATE CASCADE;
