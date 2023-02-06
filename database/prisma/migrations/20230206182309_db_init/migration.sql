/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `CreateServiceResponse` table. All the data in the column will be lost.
  - You are about to drop the column `actionId` on the `Reaction` table. All the data in the column will be lost.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Webhook` table. All the data in the column will be lost.
  - Added the required column `serviceName` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionName` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "CreateServiceResponse" DROP CONSTRAINT "CreateServiceResponse_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_actionId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_serviceId_fkey";

-- DropIndex
DROP INDEX "Service_id_key";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "id",
DROP COLUMN "serviceId",
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("serviceName", "name");

-- AlterTable
ALTER TABLE "CreateServiceResponse" DROP COLUMN "serviceId",
ADD COLUMN     "serviceName" TEXT;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "actionId",
ADD COLUMN     "actionName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "serviceId",
ADD COLUMN     "serviceName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_actionName_fkey" FOREIGN KEY ("actionName") REFERENCES "Action"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreateServiceResponse" ADD CONSTRAINT "CreateServiceResponse_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("name") ON DELETE SET NULL ON UPDATE CASCADE;
