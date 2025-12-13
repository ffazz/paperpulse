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
    const timeRange = searchParams.get('timeRange') || '7d' // 7d, 30d, all
    const limit = parseInt(searchParams.get('limit') || '10')

    // Calculate date based on timeRange
    const now = new Date()
    let dateFilter = new Date(0)

    if (timeRange === '7d') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (timeRange === '30d') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: dateFilter
        }
      },
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
        { likeCount: 'desc' },
        { commentCount: 'desc' },
        { viewCount: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        commentCount: post._count.comments,
        likeCount: post._count.likes
      })),
      timeRange
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching trending posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending posts' },
      { status: 500 }
    )
  }
}
