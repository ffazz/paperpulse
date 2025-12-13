-- AlterTable
ALTER TABLE "books" ADD COLUMN     "discussionCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "reading_goal_books" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'reading',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_goal_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reading_goal_books_goalId_idx" ON "reading_goal_books"("goalId");

-- CreateIndex
CREATE INDEX "reading_goal_books_status_idx" ON "reading_goal_books"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reading_goal_books_goalId_bookId_key" ON "reading_goal_books"("goalId", "bookId");

-- CreateIndex
CREATE INDEX "posts_bookId_idx" ON "posts"("bookId");

-- AddForeignKey
ALTER TABLE "reading_goal_books" ADD CONSTRAINT "reading_goal_books_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "reading_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_goal_books" ADD CONSTRAINT "reading_goal_books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
