-- CreateTable
CREATE TABLE "Opinion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL,
    "replyToId" UUID,
    "watchlistItemId" UUID NOT NULL,
    "text" TEXT NOT NULL DEFAULT E'',
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opinion_watchlistItemId_key" ON "Opinion"("watchlistItemId");

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
