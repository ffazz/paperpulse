import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RecommendationEngine } from '@/lib/recommendation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bookId = searchParams.get('bookId')
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
    }

    const targetBook = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    })

    if (!targetBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    const allBooks = await prisma.book.findMany()
    const recommendations = RecommendationEngine.getRecommendations(
      targetBook as any,
      allBooks as any,
      limit
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vibesQuery } = body

    if (!vibesQuery) {
      return NextResponse.json({ error: 'vibesQuery is required' }, { status: 400 })
    }

    const allBooks = await prisma.book.findMany()
    const results = RecommendationEngine.searchByVibes(vibesQuery, allBooks as any)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching by vibes:', error)
    return NextResponse.json({ error: 'Failed to search by vibes' }, { status: 500 })
  }
}
