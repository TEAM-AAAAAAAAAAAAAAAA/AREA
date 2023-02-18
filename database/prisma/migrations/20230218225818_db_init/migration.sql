/*
  Warnings:

  - A unique constraint covering the columns `[providerUserId,oAuthProviderName]` on the table `oAuthUserData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "oAuthUserData_providerUserId_oAuthProviderName_key" ON "oAuthUserData"("providerUserId", "oAuthProviderName");
