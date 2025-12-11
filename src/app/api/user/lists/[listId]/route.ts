import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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
      include: {
        books: {
          include: { book: true },
          orderBy: { addedAt: 'desc' },
        },
      },
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // Check authorization
    if (list.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const { name, description, isPublic } = await request.json()

    // Validation
    if (name && name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be 500 characters or less' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    
    if (isPublic !== undefined) {
      updateData.isPublic = isPublic
      if (isPublic && !list.shareSlug) {
        const { nanoid } = await import('nanoid')
        updateData.shareSlug = nanoid(8)
      }
    }

    const updatedList = await prisma.readingList.update({
      where: { id: listId },
      data: updateData,
      include: {
        books: {
          include: { book: true },
          orderBy: { addedAt: 'desc' },
        },
      },
    })

    return NextResponse.json(updatedList)
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json(
      { error: 'Failed to update list' },
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
      include: { books: true },
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Decrement bookmarkCount for all books in list
    for (const listBook of list.books) {
      await prisma.book.update({
        where: { id: listBook.bookId },
        data: { bookmarkCount: { decrement: 1 } },
      })
    }

    await prisma.readingList.delete({
      where: { id: listId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting list:', error)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}

