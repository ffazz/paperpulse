import { prisma } from "./prisma";

/**
 * Create a post like notification
 * Notify post author when someone likes their post
 */
export async function createPostLikeNotification(
  postId: string,
  postAuthorId: string,
  likerId: string
): Promise<void> {
  // Don't notify if user likes their own post
  if (likerId === postAuthorId) return;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true },
    });

    if (!post) return;

    const liker = await prisma.user.findUnique({
      where: { id: likerId },
      select: { id: true, name: true },
    });

    if (!liker) return;

    await prisma.notification.create({
      data: {
        userId: postAuthorId,
        type: "post_like",
        title: `${liker.name || "Someone"} liked your post`,
        message: `"${post.title}"`,
        actionUrl: `/circle/posts/${postId}`,
        actorId: likerId,
        metadata: {
          postId: post.id,
          postTitle: post.title,
        },
      },
    });
  } catch (error) {
    console.error("Error creating post like notification:", error);
  }
}

/**
 * Create a post comment notification
 * Notify post author when someone comments on their post
 */
export async function createPostCommentNotification(
  postId: string,
  postAuthorId: string,
  commenterId: string,
  commentId: string
): Promise<void> {
  // Don't notify if user comments on their own post
  if (commenterId === postAuthorId) return;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true },
    });

    if (!post) return;

    const commenter = await prisma.user.findUnique({
      where: { id: commenterId },
      select: { id: true, name: true },
    });

    if (!commenter) return;

    await prisma.notification.create({
      data: {
        userId: postAuthorId,
        type: "post_comment",
        title: `${commenter.name || "Someone"} commented on your post`,
        message: `"${post.title}"`,
        actionUrl: `/circle/posts/${postId}#comments`,
        actorId: commenterId,
        metadata: {
          postId: post.id,
          postTitle: post.title,
          commentId,
        },
      },
    });
  } catch (error) {
    console.error("Error creating post comment notification:", error);
  }
}

/**
 * Create a comment reply notification
 * Notify comment author when someone replies to their comment
 */
export async function createCommentReplyNotification(
  parentCommentId: string,
  parentCommentAuthorId: string,
  replierId: string,
  postId: string
): Promise<void> {
  // Don't notify if user replies to their own comment
  if (replierId === parentCommentAuthorId) return;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true },
    });

    if (!post) return;

    const replier = await prisma.user.findUnique({
      where: { id: replierId },
      select: { id: true, name: true },
    });

    if (!replier) return;

    await prisma.notification.create({
      data: {
        userId: parentCommentAuthorId,
        type: "comment_reply",
        title: `${replier.name || "Someone"} replied to your comment`,
        message: `in "${post.title}"`,
        actionUrl: `/circle/posts/${postId}#comment-${parentCommentId}`,
        actorId: replierId,
        metadata: {
          postId: post.id,
          postTitle: post.title,
          commentId: parentCommentId,
        },
      },
    });
  } catch (error) {
    console.error("Error creating comment reply notification:", error);
  }
}

/**
 * Create a comment like notification
 * Notify comment author when someone likes their comment
 */
export async function createCommentLikeNotification(
  commentId: string,
  commentAuthorId: string,
  likerId: string,
  postId: string
): Promise<void> {
  // Don't notify if user likes their own comment
  if (likerId === commentAuthorId) return;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true },
    });

    if (!post) return;

    const liker = await prisma.user.findUnique({
      where: { id: likerId },
      select: { id: true, name: true },
    });

    if (!liker) return;

    await prisma.notification.create({
      data: {
        userId: commentAuthorId,
        type: "comment_like",
        title: `${liker.name || "Someone"} liked your comment`,
        message: `in "${post.title}"`,
        actionUrl: `/circle/posts/${postId}#comment-${commentId}`,
        actorId: likerId,
        metadata: {
          postId: post.id,
          postTitle: post.title,
          commentId,
        },
      },
    });
  } catch (error) {
    console.error("Error creating comment like notification:", error);
  }
}

/**
 * Create a goal milestone notification
 * Notify user when they reach reading goal milestones (25%, 50%, 75%, 100%)
 */
export async function createGoalMilestoneNotification(
  userId: string,
  percentage: number,
  year: number
): Promise<void> {
  try {
    // Check if we already notified for this milestone by querying all and filtering
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    const existingNotifications = await prisma.notification.findMany({
      where: {
        userId,
        type: "goal_milestone",
        createdAt: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
    });

    const alreadyNotified = existingNotifications.some(
      (notif) =>
        (notif.metadata as Record<string, number | string | unknown>)?.percentage === percentage
    );

    if (alreadyNotified) return;

    await prisma.notification.create({
      data: {
        userId,
        type: "goal_milestone",
        title: "🎉 Reading Goal Milestone!",
        message: `You've completed ${percentage}% of your ${year} reading goal!`,
        actionUrl: "/reading-lists?tab=goal",
        metadata: {
          percentage,
          year,
        },
      },
    });
  } catch (error) {
    console.error("Error creating goal milestone notification:", error);
  }
}

/**
 * Create a reading streak notification
 * Notify user when they reach streak milestones (7, 30, 100 days)
 */
export async function createStreakNotification(
  userId: string,
  days: number
): Promise<void> {
  try {
    // Check if we already notified for this milestone
    const existingNotifications = await prisma.notification.findMany({
      where: {
        userId,
        type: "streak_achievement",
      },
    });

    const alreadyNotified = existingNotifications.some(
      (notif) =>
        (notif.metadata as Record<string, number | string | unknown>)?.days === days
    );

    if (alreadyNotified) return;

    await prisma.notification.create({
      data: {
        userId,
        type: "streak_achievement",
        title: `🔥 ${days}-day Reading Streak!`,
        message: "Keep up the great work!",
        actionUrl: "/profile",
        metadata: {
          days,
        },
      },
    });
  } catch (error) {
    console.error("Error creating streak notification:", error);
  }
}

/**
 * Create a system announcement notification
 * Used by admins to broadcast important updates to all users
 */
export async function createSystemAnnouncement(
  message: string,
  userIds?: string[]
): Promise<void> {
  try {
    if (userIds && userIds.length > 0) {
      // Notify specific users
      await Promise.all(
        userIds.map((userId) =>
          prisma.notification.create({
            data: {
              userId,
              type: "system_announcement",
              title: "System Update",
              message,
              metadata: {},
            },
          })
        )
      );
    } else {
      // Notify all users (bulk insert)
      const users = await prisma.user.findMany({
        select: { id: true },
      });

      await Promise.all(
        users.map((user) =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type: "system_announcement",
              title: "System Update",
              message,
              metadata: {},
            },
          })
        )
      );
    }
  } catch (error) {
    console.error("Error creating system announcement:", error);
  }
}
