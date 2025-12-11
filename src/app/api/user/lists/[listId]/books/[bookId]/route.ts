import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ listId: string; bookId: string }> }
) {
  try {
    const resolvedParams = await params
    const { listId, bookId: bookIdStr } = resolvedParams
    const bookId = parseInt(bookIdStr)

    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 })
    }

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

    const list = await prisma.readingList.findUnique({
      where: { id: listId },
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { note, favoriteQuote } = await request.json()

    // Validation
    if (note && note.length > 2000) {
      return NextResponse.json(
        { error: 'Note must be 2000 characters or less' },
        { status: 400 }
      )
    }

    if (favoriteQuote && favoriteQuote.length > 1000) {
      return NextResponse.json(
        { error: 'Quote must be 1000 characters or less' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (note !== undefined) updateData.note = note?.trim() || null
    if (favoriteQuote !== undefined) updateData.favoriteQuote = favoriteQuote?.trim() || null

    const listBook = await prisma.readingListBook.update({
      where: {
        listId_bookId: {
          listId,
          bookId,
        },
      },
      data: updateData,
      include: { book: true },
    })

    return NextResponse.json(listBook)
  } catch (error) {
    console.error('Error updating book note:', error)
    return NextResponse.json(
      { error: 'Failed to update book note' },
      { status: 500 }
    )
  }
}
