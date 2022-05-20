-- CreateTable
CREATE TABLE "Opinion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authorId" UUID,
    "entryImdb" TEXT,
    "replyToId" UUID,
    "text" TEXT,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_entryImdb_fkey" FOREIGN KEY ("entryImdb") REFERENCES "Entry"("imdbId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Opinion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
