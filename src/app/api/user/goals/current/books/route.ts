import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch books in current year's reading goal
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
    const status = req.nextUrl.searchParams.get('status') // reading, completed, all

    const currentYear = new Date().getFullYear()

    // Get or create current year goal
    let goal = await prisma.readingGoal.findUnique({
      where: {
        userId_year: {
          userId: session.user.id,
          year: currentYear
        }
      }
    })

    if (!goal) {
      // Create goal if doesn't exist
      goal = await prisma.readingGoal.create({
        data: {
          userId: session.user.id,
          year: currentYear,
          targetBooks: 12 // Default target
        }
      })
    }

    // Build filter
    const where: any = { goalId: goal.id }
    if (status && status !== 'all') {
      where.status = status
    }

    // Fetch books
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
      where: { goalId: goal.id },
      _count: true
    })

    const statsMap = Object.fromEntries(
      stats.map((s: any) => [s.status, s._count])
    )

    return NextResponse.json({
      goal: {
        id: goal.id,
        year: goal.year,
        targetBooks: goal.targetBooks,
        currentBooks: goal.currentBooks
      },
      books: goalBooks,
      stats: {
        total,
        completed: statsMap.completed || 0,
        reading: statsMap.reading || 0
      },
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching current goal books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}
