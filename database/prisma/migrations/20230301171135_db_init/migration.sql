/*
  Warnings:

  - The primary key for the `DiscordBotWebhook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[command,userId,serverId]` on the table `DiscordBotWebhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverId` to the `DiscordBotWebhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DiscordBotWebhook_command_userId_key";

-- AlterTable
ALTER TABLE "DiscordBotWebhook" DROP CONSTRAINT "DiscordBotWebhook_pkey",
ADD COLUMN     "serverId" TEXT NOT NULL,
ADD CONSTRAINT "DiscordBotWebhook_pkey" PRIMARY KEY ("command", "userId", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordBotWebhook_command_userId_serverId_key" ON "DiscordBotWebhook"("command", "userId", "serverId");
