/*
  Warnings:

  - A unique constraint covering the columns `[actionName]` on the table `Action` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CreateActionResponse" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT NOT NULL,
    "actionName" TEXT,

    CONSTRAINT "CreateActionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Action_actionName_key" ON "Action"("actionName");

-- AddForeignKey
ALTER TABLE "CreateActionResponse" ADD CONSTRAINT "CreateActionResponse_actionName_fkey" FOREIGN KEY ("actionName") REFERENCES "Action"("actionName") ON DELETE SET NULL ON UPDATE CASCADE;
