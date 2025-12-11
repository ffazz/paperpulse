import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all books in a reading goal
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = await params
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
    const status = req.nextUrl.searchParams.get('status') // reading, completed, all

    // Verify goal belongs to user
    const goal = await prisma.readingGoal.findUnique({
      where: { id: goalId },
      select: { userId: true }
    })

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Build query filter
    const where: any = { goalId }
    if (status && status !== 'all') {
      where.status = status
    }

    // Fetch books with pagination
    const [goalBooks, total] = await Promise.all([
      prisma.readingGoalBook.findMany({
        where,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              authors: true,
              cover_image_url: true,
              averageRating: true,
              pageCount: true
            }
          }
        },
        orderBy: [
          { completedAt: 'desc' },
          { startedAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.readingGoalBook.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.readingGoalBook.groupBy({
      by: ['status'],
      where: { goalId },
      _count: true
    })

    const statsMap = Object.fromEntries(
      stats.map((s: any) => [s.status, s._count])
    )

    return NextResponse.json({
      books: goalBooks,
      stats: {
        total,
        completed: statsMap.completed || 0,
        reading: statsMap.reading || 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching goal books:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST - Add book to reading goal
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = await params
    const body = await req.json()
    const { bookId, status = 'reading', startedAt, completedAt, rating } = body

    // Validate input
    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
    }

    // Verify goal belongs to user and book exists
    const [goal, book] = await Promise.all([
      prisma.readingGoal.findUnique({
        where: { id: goalId },
        select: { userId: true, id: true }
      }),
      prisma.book.findUnique({
        where: { id: bookId },
        select: { id: true, bookmarkCount: true }
      })
    ])

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Check if book already in goal
    const existing = await prisma.readingGoalBook.findUnique({
      where: { goalId_bookId: { goalId, bookId } }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Book already in goal' },
        { status: 409 }
      )
    }

    // Create goal book
    const goalBook = await prisma.readingGoalBook.create({
      data: {
        goalId,
        bookId,
        status,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        completedAt: completedAt ? new Date(completedAt) : null,
        rating: rating ? parseFloat(rating) : null
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            authors: true,
            cover_image_url: true,
            averageRating: true,
            pageCount: true
          }
        }
      }
    })

    // Update goal currentBooks if completed
    if (status === 'completed') {
      await prisma.readingGoal.update({
        where: { id: goalId },
        data: { currentBooks: { increment: 1 } }
      })
    }

    // Increment book bookmarkCount
    await prisma.book.update({
      where: { id: bookId },
      data: { bookmarkCount: { increment: 1 } }
    })

    return NextResponse.json(goalBook, { status: 201 })
  } catch (error) {
    console.error('Error adding book to goal:', error)
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 })
  }
}

// DELETE - Remove book from reading goal
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId } = await params
    const bookId = parseInt(req.nextUrl.searchParams.get('bookId') || '0')

    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 })
    }

    // Verify goal belongs to user
    const goal = await prisma.readingGoal.findUnique({
      where: { id: goalId },
      select: { userId: true }
    })

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Get the goal book to check its status
    const goalBook = await prisma.readingGoalBook.findUnique({
      where: { goalId_bookId: { goalId, bookId } }
    })

    if (!goalBook) {
      return NextResponse.json({ error: 'Book not in goal' }, { status: 404 })
    }

    // Delete goal book
    await prisma.readingGoalBook.delete({
      where: { id: goalBook.id }
    })

    // Update goal currentBooks if was completed
    if (goalBook.status === 'completed') {
      await prisma.readingGoal.update({
        where: { id: goalId },
        data: { currentBooks: { decrement: 1 } }
      })
    }

    // Decrement book bookmarkCount
    await prisma.book.update({
      where: { id: bookId },
      data: { bookmarkCount: { decrement: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing book from goal:', error)
    return NextResponse.json({ error: 'Failed to remove book' }, { status: 500 })
  }
}
