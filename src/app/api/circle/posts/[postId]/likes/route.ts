import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createPostLikeNotification } from '@/lib/notification-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
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

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if already liked
    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id
        }
      }
    })

    if (existing) {
      // Unlike
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id
          }
        }
      })

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          postId,
          userId: session.user.id
        }
      })

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } }
      })

      // Send notification to post author
      await createPostLikeNotification(postId, post.authorId, session.user.id)

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('[CIRCLE_API] Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
