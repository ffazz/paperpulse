-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "vibes" TEXT[],
    "themes" TEXT[],
    "pages" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'English',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Book_genre_idx" ON "Book"("genre");

-- CreateIndex
CREATE INDEX "Book_rating_idx" ON "Book"("rating");

-- CreateIndex
CREATE INDEX "Book_year_idx" ON "Book"("year");

-- CreateIndex
CREATE INDEX "Book_language_idx" ON "Book"("language");
