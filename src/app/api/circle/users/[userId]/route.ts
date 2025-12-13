import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with circle stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            postLikes: true,
            commentLikes: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's recent posts
    const recentPosts = await prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Get user's favorite books (from posts)
    const favoriteBooks = await prisma.post.groupBy({
      by: ['bookId'],
      where: { authorId: userId, bookId: { not: null } },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    // Get favorite book details
    const bookIds = favoriteBooks
      .map(fb => fb.bookId)
      .filter((id): id is number => id !== null)
    
    const books = bookIds.length > 0
      ? await prisma.book.findMany({
          where: { id: { in: bookIds } },
          select: {
            id: true,
            title: true,
            authors: true,
            cover_image_url: true
          }
        })
      : []

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        createdAt: user.createdAt,
        stats: {
          totalPosts: user._count.posts,
          totalComments: user._count.comments,
          totalLikes: user._count.postLikes,
          totalCommentLikes: user._count.commentLikes
        }
      },
      recentPosts: recentPosts.map(post => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments
      })),
      favoriteBooks: books
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
