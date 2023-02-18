-- CreateTable
CREATE TABLE "DiscordBotWebhook" (
    "command" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webhookWebhookId" TEXT NOT NULL,

    CONSTRAINT "DiscordBotWebhook_pkey" PRIMARY KEY ("command","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordBotWebhook_command_userId_key" ON "DiscordBotWebhook"("command", "userId");

-- AddForeignKey
ALTER TABLE "DiscordBotWebhook" ADD CONSTRAINT "DiscordBotWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordBotWebhook" ADD CONSTRAINT "DiscordBotWebhook_webhookWebhookId_fkey" FOREIGN KEY ("webhookWebhookId") REFERENCES "Webhook"("webhookId") ON DELETE RESTRICT ON UPDATE CASCADE;
