import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { 
            id: true, 
            name: true, 
            image: true,
            bio: true
          }
        },
        book: {
          select: { id: true, title: true, cover_image_url: true }
        },
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: { id: true, name: true, image: true }
            },
            replies: {
              include: {
                author: {
                  select: { id: true, name: true, image: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        likes: {
          where: { userId: session.user.id },
          select: { id: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      ...post,
      isLiked: post.likes.length > 0
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { title, content, category, tags, isPinned } = await req.json()

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(isPinned !== undefined && { isPinned })
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        book: true
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[CIRCLE_API] Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, bookId: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: postId }
    })

    // Decrement book discussionCount if bookId exists
    if (post.bookId) {
      await prisma.book.update({
        where: { id: post.bookId },
        data: { discussionCount: { decrement: 1 } }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CIRCLE_API] Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
