/*
  Warnings:

  - Added the required column `channelId` to the `DiscordBotWebhook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `DiscordBotWebhook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordBotWebhook" ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "serverId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DiscordMessageQueue" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "DiscordMessageQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordMessageQueue_id_key" ON "DiscordMessageQueue"("id");
