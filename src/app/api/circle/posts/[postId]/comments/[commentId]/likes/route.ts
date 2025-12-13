import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createCommentLikeNotification } from '@/lib/notification-service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if already liked
    const existing = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: session.user.id
        }
      }
    })

    if (existing) {
      // Unlike
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId: session.user.id
          }
        }
      })

      await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.commentLike.create({
        data: {
          commentId,
          userId: session.user.id
        }
      })

      await prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } }
      })

      // Send notification to comment author
      await createCommentLikeNotification(
        commentId,
        comment.authorId,
        session.user.id,
        postId
      )

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('[CIRCLE_API] Error toggling comment like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
