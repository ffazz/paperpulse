import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareSlug: string }> }
) {
  try {
    const resolvedParams = await params
    const { shareSlug } = resolvedParams

    const list = await prisma.readingList.findUnique({
      where: { shareSlug },
      include: {
        books: {
          include: { book: true },
          orderBy: { addedAt: 'desc' },
        },
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (!list.isPublic) {
      return NextResponse.json({ error: 'This list is private' }, { status: 403 })
    }

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching public list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}
