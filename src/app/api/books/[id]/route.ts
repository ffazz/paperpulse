import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
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

    // Add goal info if user is authenticated
    let inUserGoal = false
    let inUserLists: string[] = []

    if (session?.user?.id) {
      // Check if book is in user's current year goal
      const currentYear = new Date().getFullYear()
      const goalBook = await prisma.readingGoalBook.findFirst({
        where: {
          bookId,
          goal: {
            userId: session.user.id,
            year: currentYear
          }
        }
      })
      inUserGoal = !!goalBook

      // Check if book is in user's lists
      const lists = await prisma.readingListBook.findMany({
        where: {
          bookId,
          list: { userId: session.user.id }
        },
        include: { list: { select: { name: true } } }
      })
      inUserLists = lists.map(l => l.list.name)
    }

    console.log(`✅ Found book: ${book.title}`)
    return NextResponse.json({
      ...book,
      inUserGoal,
      inUserLists
    })
    
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
