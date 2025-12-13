import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const bookIdNum = parseInt(bookId)

    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: bookIdNum }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { bookId: bookIdNum },
        include: {
          author: {
            select: { id: true, name: true, image: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip
      }),
      prisma.post.count({ where: { bookId: bookIdNum } })
    ])

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        commentCount: post._count.comments,
        likeCount: post._count.likes
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
      book: {
        id: book.id,
        title: book.title,
        authors: book.authors,
        cover_image_url: book.cover_image_url
      }
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching book posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book posts' },
      { status: 500 }
    )
  }
}
