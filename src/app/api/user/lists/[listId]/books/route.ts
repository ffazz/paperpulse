import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const resolvedParams = await params
    const { listId } = resolvedParams

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

    const { bookId, note, favoriteQuote } = await request.json()

    if (!bookId || typeof bookId !== 'number') {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

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

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Check if book already in list
    const existing = await prisma.readingListBook.findUnique({
      where: {
        listId_bookId: {
          listId,
          bookId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Book already in this list' },
        { status: 400 }
      )
    }

    const listBook = await prisma.readingListBook.create({
      data: {
        listId,
        bookId,
        note: note?.trim() || null,
        favoriteQuote: favoriteQuote?.trim() || null,
      },
      include: { book: true },
    })

    // Increment bookmarkCount
    await prisma.book.update({
      where: { id: bookId },
      data: { bookmarkCount: { increment: 1 } },
    })

    // Update list updatedAt
    await prisma.readingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(listBook, { status: 201 })
  } catch (error) {
    console.error('Error adding book to list:', error)
    return NextResponse.json(
      { error: 'Failed to add book to list' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const resolvedParams = await params
    const { listId } = resolvedParams

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

    const { searchParams } = new URL(request.url)
    const bookId = parseInt(searchParams.get('bookId') || '')

    if (!bookId || isNaN(bookId)) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    const listBook = await prisma.readingListBook.findUnique({
      where: {
        listId_bookId: {
          listId,
          bookId,
        },
      },
    })

    if (!listBook) {
      return NextResponse.json(
        { error: 'Book not in list' },
        { status: 404 }
      )
    }

    await prisma.readingListBook.delete({
      where: {
        listId_bookId: {
          listId,
          bookId,
        },
      },
    })

    // Decrement bookmarkCount
    await prisma.book.update({
      where: { id: bookId },
      data: { bookmarkCount: { decrement: 1 } },
    })

    // Update list updatedAt
    await prisma.readingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing book from list:', error)
    return NextResponse.json(
      { error: 'Failed to remove book from list' },
      { status: 500 }
    )
  }
}
