import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const session = await auth()
    const currentUserId = session?.user?.id

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isPublic: true,
        createdAt: true,
        favoriteGenres: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check privacy
    if (!user.isPublic && currentUserId !== userId) {
      return NextResponse.json(
        { error: 'This profile is private' },
        { status: 403 }
      )
    }

    // Get detailed statistics
    const readingGoals = await prisma.readingGoal.findMany({
      where: { userId },
      include: {
        books: {
          where: { status: 'COMPLETED' }
        }
      }
    })

    const booksRead = await prisma.readingGoalBook.count({
      where: {
        goal: { userId },
        status: 'COMPLETED'
      }
    })

    const currentYear = new Date().getFullYear()
    const currentGoal = readingGoals.find(g => g.year === currentYear)

    const lists = await prisma.readingList.count({
      where: { userId }
    })

    const postsCount = await prisma.post.count({
      where: { authorId: userId }
    })

    const commentsCount = await prisma.comment.count({
      where: { authorId: userId }
    })

    const likesCount = await prisma.postLike.count({
      where: {
        post: { authorId: userId }
      }
    })

    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Calculate reading streak
    let readingStreak = 0
    let longestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    for (const activity of activities) {
      if (activity.type === 'READ') {
        const activityDate = new Date(activity.createdAt)
        
        if (!lastDate) {
          currentStreak = 1
        } else {
          const daysDiff = Math.floor((lastDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysDiff === 1) {
            currentStreak += 1
          } else if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, currentStreak)
            currentStreak = 1
          }
        }
        
        lastDate = activityDate
      }
    }
    
    readingStreak = currentStreak
    longestStreak = Math.max(longestStreak, currentStreak)

    // Get profile views count (only for owner)
    let profileViews = 0
    if (currentUserId === userId) {
      profileViews = await prisma.profileView.count({
        where: { profileUserId: userId }
      })
    }

    return NextResponse.json({
      userId,
      stats: {
        totalBooksRead: booksRead,
        totalLists: lists,
        totalPosts: postsCount,
        totalComments: commentsCount,
        totalLikes: likesCount,
        profileViews,
        readingStreak,
        longestStreak,
        joinedDate: user.createdAt,
        genres: user.favoriteGenres || []
      },
      currentGoal: currentGoal ? {
        year: currentGoal.year,
        targetBooks: currentGoal.targetBooks,
        currentBooks: currentGoal.books.length,
        percentage: Math.round((currentGoal.books.length / currentGoal.targetBooks) * 100)
      } : null,
      breakdown: {
        posts: {
          total: postsCount,
          label: 'Circle Posts'
        },
        comments: {
          total: commentsCount,
          label: 'Comments'
        },
        likes: {
          total: likesCount,
          label: 'Likes Given'
        },
        lists: {
          total: lists,
          label: 'Reading Lists'
        },
        books: {
          total: booksRead,
          label: 'Books Read'
        }
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
