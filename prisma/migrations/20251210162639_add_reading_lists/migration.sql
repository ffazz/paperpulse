-- AlterTable
ALTER TABLE "books" ALTER COLUMN "publisher" DROP NOT NULL;

-- CreateTable
CREATE TABLE "reading_lists" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareSlug" VARCHAR(12),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_list_books" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "note" TEXT,
    "favoriteQuote" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_list_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "targetBooks" INTEGER NOT NULL,
    "currentBooks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reading_lists_shareSlug_key" ON "reading_lists"("shareSlug");

-- CreateIndex
CREATE INDEX "reading_lists_userId_idx" ON "reading_lists"("userId");

-- CreateIndex
CREATE INDEX "reading_lists_shareSlug_idx" ON "reading_lists"("shareSlug");

-- CreateIndex
CREATE INDEX "reading_lists_updatedAt_idx" ON "reading_lists"("updatedAt");

-- CreateIndex
CREATE INDEX "reading_list_books_listId_idx" ON "reading_list_books"("listId");

-- CreateIndex
CREATE INDEX "reading_list_books_bookId_idx" ON "reading_list_books"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_list_books_listId_bookId_key" ON "reading_list_books"("listId", "bookId");

-- CreateIndex
CREATE INDEX "reading_goals_userId_idx" ON "reading_goals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_goals_userId_year_key" ON "reading_goals"("userId", "year");

-- AddForeignKey
ALTER TABLE "reading_lists" ADD CONSTRAINT "reading_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_list_books" ADD CONSTRAINT "reading_list_books_listId_fkey" FOREIGN KEY ("listId") REFERENCES "reading_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_list_books" ADD CONSTRAINT "reading_list_books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_goals" ADD CONSTRAINT "reading_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
