/*
  Warnings:

  - A unique constraint covering the columns `[reactionId]` on the table `ActionReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_reactionId_key" ON "ActionReaction"("reactionId");
