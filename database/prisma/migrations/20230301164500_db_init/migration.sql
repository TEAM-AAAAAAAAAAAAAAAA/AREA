/*
  Warnings:

  - Added the required column `embed` to the `DiscordMessageQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordMessageQueue" ADD COLUMN     "embed" BOOLEAN NOT NULL;
