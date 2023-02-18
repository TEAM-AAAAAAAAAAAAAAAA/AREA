-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'API', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthUserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "OAuthProviderName" TEXT NOT NULL,

    CONSTRAINT "OAuthUserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthProvider" (
    "name" TEXT NOT NULL,

    CONSTRAINT "OAuthProvider_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "type" "TokenType" NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceName" TEXT NOT NULL,
    "OAuthProviderName" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceName")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "webhookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "incomingServiceName" TEXT NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("webhookId")
);

-- CreateTable
CREATE TABLE "Action" (
    "actionName" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("serviceName","actionName")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "reactionId" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    "outgoingWebhook" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "enabledChain" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("reactionId")
);

-- CreateTable
CREATE TABLE "ActionReaction" (
    "actionId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,

    CONSTRAINT "ActionReaction_pkey" PRIMARY KEY ("actionId","reactionId")
);

-- CreateTable
CREATE TABLE "CreateUserResponse" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CreateUserResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateServiceResponse" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "serviceName" TEXT,

    CONSTRAINT "CreateServiceResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthProvider_name_key" ON "OAuthProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Service_OAuthProviderName_key" ON "Service"("OAuthProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_reactionId_key" ON "Webhook"("reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Action_serviceName_actionName_key" ON "Action"("serviceName", "actionName");

-- AddForeignKey
ALTER TABLE "OAuthUserData" ADD CONSTRAINT "OAuthUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthUserData" ADD CONSTRAINT "OAuthUserData_OAuthProviderName_fkey" FOREIGN KEY ("OAuthProviderName") REFERENCES "OAuthProvider"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_OAuthProviderName_fkey" FOREIGN KEY ("OAuthProviderName") REFERENCES "OAuthProvider"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_incomingServiceName_fkey" FOREIGN KEY ("incomingServiceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_actionName_fkey" FOREIGN KEY ("serviceName", "actionName") REFERENCES "Action"("serviceName", "actionName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "action" FOREIGN KEY ("actionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "reaction" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreateUserResponse" ADD CONSTRAINT "CreateUserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreateServiceResponse" ADD CONSTRAINT "CreateServiceResponse_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE SET NULL ON UPDATE CASCADE;
