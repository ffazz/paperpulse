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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: { id: true, name: true, image: true, bio: true }
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
      prisma.post.count({ where: { authorId: userId } })
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
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio
      }
    })
  } catch (error) {
    console.error('[CIRCLE_API] Error fetching user posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    )
  }
}
