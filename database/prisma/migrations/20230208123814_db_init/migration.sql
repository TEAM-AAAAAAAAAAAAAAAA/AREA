/*
  Warnings:

  - A unique constraint covering the columns `[actionId]` on the table `ActionReaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reactionId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActionReaction_actionId_key" ON "ActionReaction"("actionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_reactionId_key" ON "Reaction"("reactionId");
