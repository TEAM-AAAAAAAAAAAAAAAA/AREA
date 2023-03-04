-- CreateTable
CREATE TABLE "ActionWebhook" (
    "actionWebhookId" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,

    CONSTRAINT "ActionWebhook_pkey" PRIMARY KEY ("actionWebhookId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionWebhook_actionWebhookId_key" ON "ActionWebhook"("actionWebhookId");

-- AddForeignKey
ALTER TABLE "ActionWebhook" ADD CONSTRAINT "ActionWebhook_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionWebhook" ADD CONSTRAINT "ActionWebhook_actionName_serviceName_fkey" FOREIGN KEY ("actionName", "serviceName") REFERENCES "Action"("actionName", "serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionWebhook" ADD CONSTRAINT "ActionWebhook_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("webhookId") ON DELETE RESTRICT ON UPDATE CASCADE;
