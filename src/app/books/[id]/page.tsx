import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookDetailHero from '@/components/books/BookDetailHero'
import RecommendationSection from '@/components/books/RecommendationSection'

export default async function BookDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  })

  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-6xl">
        {/* Book Detail Hero */}
        <BookDetailHero book={book} />

        {/* Recommendation Section */}
        <RecommendationSection bookId={book.id} />
      </div>
    </div>
  )
}
