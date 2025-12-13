import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createPostCommentNotification, createCommentReplyNotification } from '@/lib/notification-service'
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

    const { content, parentId } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: session.user.id,
        parentId: parentId || null
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    })

    // Send notification
    if (parentId) {
      // Replying to a comment
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })
      if (parentComment) {
        await createCommentReplyNotification(
          parentId,
          parentComment.authorId,
          session.user.id,
          postId
        )
      }
    } else {
      // Commenting on post
      await createPostCommentNotification(
        postId,
        post.authorId,
        session.user.id,
        comment.id
      )
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('[CIRCLE_API] Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
