/*
  Warnings:

  - You are about to drop the `CreateActionResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreateServiceResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreateUserResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreateWebhookResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreateActionResponse" DROP CONSTRAINT "CreateActionResponse_actionName_fkey";

-- DropForeignKey
ALTER TABLE "CreateServiceResponse" DROP CONSTRAINT "CreateServiceResponse_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "CreateUserResponse" DROP CONSTRAINT "CreateUserResponse_userId_fkey";

-- DropForeignKey
ALTER TABLE "CreateWebhookResponse" DROP CONSTRAINT "CreateWebhookResponse_webhookId_fkey";

-- DropTable
DROP TABLE "CreateActionResponse";

-- DropTable
DROP TABLE "CreateServiceResponse";

-- DropTable
DROP TABLE "CreateUserResponse";

-- DropTable
DROP TABLE "CreateWebhookResponse";
