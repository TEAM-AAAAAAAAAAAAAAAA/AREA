/*
  Warnings:

  - The primary key for the `DiscordBotWebhook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discordBotWebhookId` on the `DiscordBotWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `DiscordBotWebhook` table. All the data in the column will be lost.
  - You are about to drop the column `botHookId` on the `DiscordMessageQueue` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `DiscordMessageQueue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiscordMessageQueue" DROP CONSTRAINT "DiscordMessageQueue_botHookId_fkey";

-- DropIndex
DROP INDEX "DiscordBotWebhook_discordBotWebhookId_key";

-- AlterTable
ALTER TABLE "DiscordBotWebhook" DROP CONSTRAINT "DiscordBotWebhook_pkey",
DROP COLUMN "discordBotWebhookId",
DROP COLUMN "serverId",
ADD CONSTRAINT "DiscordBotWebhook_pkey" PRIMARY KEY ("command", "userId");

-- AlterTable
ALTER TABLE "DiscordMessageQueue" DROP COLUMN "botHookId",
ADD COLUMN     "channelId" TEXT NOT NULL;
