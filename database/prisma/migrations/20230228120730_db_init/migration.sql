/*
  Warnings:

  - The primary key for the `React` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reactionName` on the `React` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceName,reactName]` on the table `React` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reactName` to the `React` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_serviceName_reactName_fkey";

-- DropIndex
DROP INDEX "React_serviceName_reactionName_key";

-- AlterTable
ALTER TABLE "React" DROP CONSTRAINT "React_pkey",
DROP COLUMN "reactionName",
ADD COLUMN     "reactName" TEXT NOT NULL,
ADD CONSTRAINT "React_pkey" PRIMARY KEY ("serviceName", "reactName");

-- CreateIndex
CREATE UNIQUE INDEX "React_serviceName_reactName_key" ON "React"("serviceName", "reactName");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_reactName_fkey" FOREIGN KEY ("serviceName", "reactName") REFERENCES "React"("serviceName", "reactName") ON DELETE RESTRICT ON UPDATE CASCADE;
