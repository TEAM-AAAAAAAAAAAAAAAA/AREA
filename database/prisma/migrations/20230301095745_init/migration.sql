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
CREATE TABLE "oAuthUserData" (
    "oAuthUserDataId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "oAuthProviderName" TEXT NOT NULL,

    CONSTRAINT "oAuthUserData_pkey" PRIMARY KEY ("oAuthUserDataId")
);

-- CreateTable
CREATE TABLE "oAuthProvider" (
    "oAuthProviderName" TEXT NOT NULL,
    "serviceName" TEXT,

    CONSTRAINT "oAuthProvider_pkey" PRIMARY KEY ("oAuthProviderName")
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
    "oAuthProviderName" TEXT,

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
    "description" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("actionName","serviceName")
);

-- CreateTable
CREATE TABLE "React" (
    "reactionName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,

    CONSTRAINT "React_pkey" PRIMARY KEY ("serviceName","reactionName")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "reactionId" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "reactionName" TEXT NOT NULL,
    "outgoingWebhook" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "enabledChain" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("reactionId")
);

-- CreateTable
CREATE TABLE "ActionReaction" (
    "id" SERIAL NOT NULL,
    "actionId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,

    CONSTRAINT "ActionReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordBotWebhook" (
    "command" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "webhookWebhookId" TEXT NOT NULL,

    CONSTRAINT "DiscordBotWebhook_pkey" PRIMARY KEY ("command","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "oAuthUserData_userId_oAuthProviderName_key" ON "oAuthUserData"("userId", "oAuthProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "oAuthUserData_providerUserId_oAuthProviderName_key" ON "oAuthUserData"("providerUserId", "oAuthProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "oAuthProvider_oAuthProviderName_key" ON "oAuthProvider"("oAuthProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "oAuthProvider_serviceName_key" ON "oAuthProvider"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_type_key" ON "Token"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceName_key" ON "Service"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "Service_oAuthProviderName_key" ON "Service"("oAuthProviderName");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_webhookId_key" ON "Webhook"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_reactionId_key" ON "Webhook"("reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Action_actionName_serviceName_key" ON "Action"("actionName", "serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "React_serviceName_reactionName_key" ON "React"("serviceName", "reactionName");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_reactionId_key" ON "Reaction"("reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_id_key" ON "ActionReaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_reactionId_key" ON "ActionReaction"("reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_actionId_reactionId_key" ON "ActionReaction"("actionId", "reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordBotWebhook_command_userId_key" ON "DiscordBotWebhook"("command", "userId");

-- AddForeignKey
ALTER TABLE "oAuthUserData" ADD CONSTRAINT "oAuthUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oAuthUserData" ADD CONSTRAINT "oAuthUserData_oAuthProviderName_fkey" FOREIGN KEY ("oAuthProviderName") REFERENCES "oAuthProvider"("oAuthProviderName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oAuthProvider" ADD CONSTRAINT "oAuthProvider_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_incomingServiceName_fkey" FOREIGN KEY ("incomingServiceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "React" ADD CONSTRAINT "React_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_reactionName_fkey" FOREIGN KEY ("serviceName", "reactionName") REFERENCES "React"("serviceName", "reactionName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "action" FOREIGN KEY ("actionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionReaction" ADD CONSTRAINT "reaction" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("reactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordBotWebhook" ADD CONSTRAINT "DiscordBotWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordBotWebhook" ADD CONSTRAINT "DiscordBotWebhook_webhookWebhookId_fkey" FOREIGN KEY ("webhookWebhookId") REFERENCES "Webhook"("webhookId") ON DELETE RESTRICT ON UPDATE CASCADE;
