import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Update book status in goal
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ goalId: string; bookId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId, bookId: bookIdStr } = await params
    const bookId = parseInt(bookIdStr)
    const body = await req.json()
    const { status, completedAt, rating } = body

    // Verify goal belongs to user
    const goal = await prisma.readingGoal.findUnique({
      where: { id: goalId },
      select: { userId: true, id: true }
    })

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Get current goal book
    const goalBook = await prisma.readingGoalBook.findUnique({
      where: { goalId_bookId: { goalId, bookId } }
    })

    if (!goalBook) {
      return NextResponse.json({ error: 'Book not in goal' }, { status: 404 })
    }

    // Track status change for goal update
    const wasCompleted = goalBook.status === 'completed'
    const willBeCompleted = status === 'completed'
    const statusChanged = status && status !== goalBook.status

    // Update goal book
    const updated = await prisma.readingGoalBook.update({
      where: { id: goalBook.id },
      data: {
        ...(status && { status }),
        ...(completedAt && { completedAt: new Date(completedAt) }),
        ...(rating !== undefined && { rating: rating ? parseFloat(rating) : null })
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

    // Update goal currentBooks count if status changed
    if (statusChanged) {
      if (!wasCompleted && willBeCompleted) {
        // Changing from reading to completed
        await prisma.readingGoal.update({
          where: { id: goalId },
          data: { currentBooks: { increment: 1 } }
        })
      } else if (wasCompleted && !willBeCompleted) {
        // Changing from completed to reading
        await prisma.readingGoal.update({
          where: { id: goalId },
          data: { currentBooks: { decrement: 1 } }
        })
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating goal book:', error)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}
