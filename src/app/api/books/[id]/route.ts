import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const bookId = parseInt(resolvedParams.id)

    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: 'Invalid book ID' },
        { status: 400 }
      )
    }

    console.log(`📖 Fetching book #${bookId}...`)

    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      console.log(`❌ Book #${bookId} not found`)
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Found book: ${book.title}`)
    return NextResponse.json(book)
    
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch book',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
