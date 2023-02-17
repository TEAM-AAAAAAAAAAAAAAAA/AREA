/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reaction` table. All the data in the column will be lost.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - The primary key for the `Webhook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Webhook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceName,actionName]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceName]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionName` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Service` table without a default value. This is not possible if the table is not empty.
  - The required column `webhookId` was added to the `Webhook` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "ActionReaction" DROP CONSTRAINT "action";

-- DropForeignKey
ALTER TABLE "ActionReaction" DROP CONSTRAINT "reaction";

-- DropForeignKey
ALTER TABLE "CreateServiceResponse" DROP CONSTRAINT "CreateServiceResponse_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_serviceName_actionName_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_serviceName_fkey";

-- DropIndex
DROP INDEX "Action_serviceName_name_key";

-- DropIndex
DROP INDEX "Service_name_key";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "name",
ADD COLUMN     "actionName" TEXT NOT NULL,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("serviceName", "actionName");

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "reactionId" SERIAL NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("reactionId");

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "name",
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceName");

-- AlterTable
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_pkey",
DROP COLUMN "id",
ADD COLUMN     "webhookId" TEXT NOT NULL,
ADD CONSTRAINT "Webhook_pkey" PRIMARY KEY ("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "Action_serviceName_actionName_key" ON "Action"("serviceName", "actionName");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_actionName_fkey" FOREIGN KEY ("serviceName", "actionName") REFERENCES "Action"("serviceName", "actionName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "action" FOREIGN KEY ("actionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "reaction" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreateServiceResponse" ADD CONSTRAINT "CreateServiceResponse_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE SET NULL ON UPDATE CASCADE;
