import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const bookId = searchParams.get('bookId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      OR: [
        {
          title: {
            contains: query.trim(),
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: query.trim(),
            mode: 'insensitive'
          }
        },
        {
          tags: {
            hasSome: [query.trim()]
          }
        }
      ]
    }

    // Add optional filters
    if (category) {
      where.category = category
    }
    if (authorId) {
      where.authorId = authorId
    }
    if (bookId) {
      where.bookId = parseInt(bookId)
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, image: true }
          },
          book: {
            select: { id: true, title: true, cover_image_url: true }
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
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error searching posts:', error)
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    )
  }
}
