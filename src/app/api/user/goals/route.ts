import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentYear = new Date().getFullYear()
    const goal = await prisma.readingGoal.findUnique({
      where: {
        userId_year: {
          userId: user.id,
          year: currentYear,
        },
      },
    })

    return NextResponse.json(goal || null)
  } catch (error) {
    console.error('Error fetching reading goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading goal' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { year, targetBooks } = await request.json()

    // Validation
    if (!year || typeof year !== 'number') {
      return NextResponse.json({ error: 'Year is required' }, { status: 400 })
    }

    if (!targetBooks || typeof targetBooks !== 'number') {
      return NextResponse.json(
        { error: 'Target books is required' },
        { status: 400 }
      )
    }

    const currentYear = new Date().getFullYear()
    if (year < currentYear) {
      return NextResponse.json(
        { error: 'Year must be current year or later' },
        { status: 400 }
      )
    }

    if (targetBooks < 1 || targetBooks > 1000) {
      return NextResponse.json(
        { error: 'Target must be between 1 and 1000' },
        { status: 400 }
      )
    }

    // Check if goal already exists
    const existing = await prisma.readingGoal.findUnique({
      where: {
        userId_year: {
          userId: user.id,
          year,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Goal already exists for this year' },
        { status: 400 }
      )
    }

    const goal = await prisma.readingGoal.create({
      data: {
        userId: user.id,
        year,
        targetBooks,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating reading goal:', error)
    return NextResponse.json(
      { error: 'Failed to create reading goal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()

    const { targetBooks, currentBooks } = await request.json()

    const goal = await prisma.readingGoal.findUnique({
      where: {
        userId_year: {
          userId: user.id,
          year,
        },
      },
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Reading goal not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (targetBooks !== undefined) {
      if (targetBooks < 1 || targetBooks > 1000) {
        return NextResponse.json(
          { error: 'Target must be between 1 and 1000' },
          { status: 400 }
        )
      }
      updateData.targetBooks = targetBooks
    }
    if (currentBooks !== undefined) {
      if (currentBooks < 0) {
        return NextResponse.json(
          { error: 'Current books cannot be negative' },
          { status: 400 }
        )
      }
      updateData.currentBooks = currentBooks
    }

    const updatedGoal = await prisma.readingGoal.update({
      where: {
        userId_year: {
          userId: user.id,
          year,
        },
      },
      data: updateData,
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Error updating reading goal:', error)
    return NextResponse.json(
      { error: 'Failed to update reading goal' },
      { status: 500 }
    )
  }
}
