import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ACHIEVEMENT_CONFIG = {
  bookworm: {
    name: 'Bookworm',
    icon: '📚',
    description: 'Read 10 books',
    condition: (stats: any) => stats.totalBooksRead >= 10
  },
  speedReader: {
    name: 'Speed Reader',
    icon: '⚡',
    description: 'Read 25 books',
    condition: (stats: any) => stats.totalBooksRead >= 25
  },
  socialButterfly: {
    name: 'Social Butterfly',
    icon: '🦋',
    description: 'Make 25 Circle posts',
    condition: (stats: any) => stats.totalPosts >= 25
  },
  communityLeader: {
    name: 'Community Leader',
    icon: '👑',
    description: 'Get 100 likes on your posts',
    condition: (stats: any) => stats.totalLikes >= 100
  },
  listMaker: {
    name: 'List Maker',
    icon: '📝',
    description: 'Create 5 reading lists',
    condition: (stats: any) => stats.totalLists >= 5
  },
  bookCollector: {
    name: 'Book Collector',
    icon: '🎁',
    description: 'Read 50 books',
    condition: (stats: any) => stats.totalBooksRead >= 50
  },
  firekeeper: {
    name: 'Firekeeper',
    icon: '🔥',
    description: 'Maintain a 7-day reading streak',
    condition: (stats: any) => stats.readingStreak >= 7
  }
}

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
      where: { id: userId }
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

    // Get user statistics
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

    const lists = await prisma.readingList.count({
      where: { userId }
    })

    const postsCount = await prisma.post.count({
      where: { authorId: userId }
    })

    const commentsCount = await prisma.comment.count({
      where: { authorId: userId }
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

    const totalLikes = await prisma.postLike.count({
      where: {
        post: { authorId: userId }
      }
    })

    const stats = {
      totalBooksRead: booksRead,
      totalLists: lists,
      totalPosts: postsCount,
      totalComments: commentsCount,
      totalLikes,
      readingStreak,
      longestStreak
    }

    // Calculate achievements
    const achievements = Object.entries(ACHIEVEMENT_CONFIG).map(([key, config]) => {
      const unlocked = config.condition(stats)
      return {
        id: key,
        name: config.name,
        icon: config.icon,
        description: config.description,
        unlocked,
        progress: {
          current: stats[Object.keys(stats).find(k => {
            const value = stats[k as keyof typeof stats]
            if (config.description.includes('10 books') && k === 'totalBooksRead') return true
            if (config.description.includes('25 books') && k === 'totalBooksRead') return true
            if (config.description.includes('25 Circle') && k === 'totalPosts') return true
            if (config.description.includes('100 likes') && k === 'totalLikes') return true
            if (config.description.includes('5 reading') && k === 'totalLists') return true
            if (config.description.includes('50 books') && k === 'totalBooksRead') return true
            if (config.description.includes('7-day') && k === 'readingStreak') return true
            return false
          }) as keyof typeof stats] || 0,
          required: parseInt(config.description.match(/\d+/)?.[0] || '1')
        }
      }
    })

    return NextResponse.json({
      userId,
      totalUnlocked: achievements.filter(a => a.unlocked).length,
      totalAchievements: achievements.length,
      achievements
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
