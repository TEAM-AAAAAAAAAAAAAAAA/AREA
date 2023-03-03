/*
  Warnings:

  - Added the required column `data` to the `oAuthProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "oAuthProvider" ADD COLUMN     "data" JSONB NOT NULL;
