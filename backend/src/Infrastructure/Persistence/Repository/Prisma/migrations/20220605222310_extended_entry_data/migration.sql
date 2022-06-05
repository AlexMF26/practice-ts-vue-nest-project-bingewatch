/*
  Warnings:

  - Added the required column `awards` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rated` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "actors" TEXT[],
ADD COLUMN     "awards" TEXT NOT NULL,
ADD COLUMN     "director" TEXT[],
ADD COLUMN     "genre" TEXT[],
ADD COLUMN     "language" TEXT[],
ADD COLUMN     "rated" TEXT NOT NULL,
ADD COLUMN     "runtime" TEXT NOT NULL,
ADD COLUMN     "writer" TEXT[],
ADD COLUMN     "year" TEXT NOT NULL;
