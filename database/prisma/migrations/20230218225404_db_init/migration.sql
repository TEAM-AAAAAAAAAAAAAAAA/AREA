/*
  Warnings:

  - Added the required column `providerUserId` to the `oAuthUserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oAuthUserData" ADD COLUMN     "providerUserId" TEXT NOT NULL;
