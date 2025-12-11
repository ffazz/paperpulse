import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BookRecommendationEngine } from '@/lib/recommendationEngine'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const bookId = parseInt(resolvedParams.id)

    // Get current book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Find candidate books (similar by basic criteria for efficiency)
    const candidates = await prisma.book.findMany({
      where: {
        AND: [
          { id: { not: bookId } },
          {
            OR: [
              { subjects: { hasSome: book.subjects } },
              { authors: { hasSome: book.authors } },
              { language: book.language },
            ],
          },
        ],
      },
      take: 50, // Get more candidates for better ranking
      orderBy: { bookmarkCount: 'desc' }, // Pre-sort by popularity
    })

    // Use advanced recommendation engine
    const recommendations = BookRecommendationEngine.getRecommendations(
      { ...book, publisher: book.publisher || undefined },
      candidates.map(c => ({ ...c, publisher: c.publisher || undefined })),
      8
    )

    return NextResponse.json({
      recommendations,
      currentBook: book,
      totalCandidates: candidates.length,
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}
