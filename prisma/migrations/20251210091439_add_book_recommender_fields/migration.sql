-- AlterTable
ALTER TABLE "books" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "ratingsCount" INTEGER,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "books_bookmarkCount_idx" ON "books"("bookmarkCount");

-- CreateIndex
CREATE INDEX "books_viewCount_idx" ON "books"("viewCount");
