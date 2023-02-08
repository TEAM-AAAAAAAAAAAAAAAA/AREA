-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enabledChain" BOOLEAN NOT NULL DEFAULT true;
