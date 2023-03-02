/*
  Warnings:

  - The primary key for the `DiscordBotWebhook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `channelId` on the `DiscordMessageQueue` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `DiscordMessageQueue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordBotWebhookId]` on the table `DiscordBotWebhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `botHookId` to the `DiscordMessageQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordBotWebhook" DROP CONSTRAINT "DiscordBotWebhook_pkey",
ADD COLUMN     "discordBotWebhookId" SERIAL NOT NULL,
ADD CONSTRAINT "DiscordBotWebhook_pkey" PRIMARY KEY ("discordBotWebhookId");

-- AlterTable
ALTER TABLE "DiscordMessageQueue" DROP COLUMN "channelId",
DROP COLUMN "serverId",
ADD COLUMN     "botHookId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DiscordBotWebhook_discordBotWebhookId_key" ON "DiscordBotWebhook"("discordBotWebhookId");

-- AddForeignKey
ALTER TABLE "DiscordMessageQueue" ADD CONSTRAINT "DiscordMessageQueue_botHookId_fkey" FOREIGN KEY ("botHookId") REFERENCES "DiscordBotWebhook"("discordBotWebhookId") ON DELETE RESTRICT ON UPDATE CASCADE;
