/*
  Warnings:

  - A unique constraint covering the columns `[serviceName,name]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceName` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_actionName_fkey";

-- DropIndex
DROP INDEX "Action_name_key";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "serviceName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Action_serviceName_name_key" ON "Action"("serviceName", "name");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_serviceName_actionName_fkey" FOREIGN KEY ("serviceName", "actionName") REFERENCES "Action"("serviceName", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
