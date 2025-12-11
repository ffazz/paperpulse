import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = category ? { category } : {}

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, image: true }
          },
          book: {
            select: { id: true, title: true, cover_image_url: true }
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
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        commentCount: post._count.comments,
        likeCount: post._count.likes
      })),
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, category, bookId, tags } = await req.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || 'Discussion',
        authorId: session.user.id,
        bookId: bookId || null,
        tags: tags || []
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        book: {
          select: { id: true, title: true, cover_image_url: true }
        }
      }
    })

    // Increment book discussionCount if bookId provided
    if (bookId) {
      await prisma.book.update({
        where: { id: bookId },
        data: { discussionCount: { increment: 1 } }
      })
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('[CIRCLE_API] Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
