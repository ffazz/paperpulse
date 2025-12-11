import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

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

    const lists = await prisma.readingList.findMany({
      where: { userId: user.id },
      include: {
        books: {
          include: { book: true },
          take: 4,
        },
        _count: { select: { books: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
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

    const { name, description, isPublic } = await request.json()

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'List name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Check list count limit (max 50 lists per user)
    const listCount = await prisma.readingList.count({
      where: { userId: user.id },
    })

    if (listCount >= 50) {
      return NextResponse.json(
        { error: 'You can only create up to 50 lists' },
        { status: 400 }
      )
    }

    const shareSlug = isPublic ? nanoid(8) : null

    const newList = await prisma.readingList.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: user.id,
        isPublic: isPublic ?? false,
        shareSlug,
      },
      include: {
        books: { include: { book: true } },
        _count: { select: { books: true } },
      },
    })

    // Track activity
    try {
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: 'created_list',
          metadata: {
            listId: newList.id,
            listName: name.substring(0, 50)
          },
          isPublic: true
        }
      })
    } catch (activityError) {
      console.error('Error tracking list creation:', activityError)
      // Don't fail the list creation if activity tracking fails
    }

    return NextResponse.json(newList, { status: 201 })
  } catch (error) {
    console.error('Error creating list:', error)
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    )
  }
}
