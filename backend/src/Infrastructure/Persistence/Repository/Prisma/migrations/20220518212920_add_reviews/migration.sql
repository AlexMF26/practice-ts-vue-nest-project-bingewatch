/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WatchlistItem" ADD COLUMN     "reviewId" UUID;

-- CreateTable
CREATE TABLE "Opinion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL,
    "replyToId" UUID,
    "text" TEXT NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_reviewId_key" ON "WatchlistItem"("reviewId");

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
