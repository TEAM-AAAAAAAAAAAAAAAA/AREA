/*
  Warnings:

  - The primary key for the `ActionReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `ActionReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ActionReaction" DROP CONSTRAINT "ActionReaction_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ActionReaction_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_id_key" ON "ActionReaction"("id");
