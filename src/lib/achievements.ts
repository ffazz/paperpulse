import { prisma } from './prisma'

export const ACHIEVEMENT_CONFIG = {
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

export async function getUserStats(userId: string) {
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

  const totalLikes = await prisma.postLike.count({
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
    if (activity.type === 'READ' || activity.type === 'completed_book') {
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

  return {
    totalBooksRead: booksRead,
    totalLists: lists,
    totalPosts: postsCount,
    totalComments: commentsCount,
    totalLikes,
    readingStreak,
    longestStreak
  }
}

export async function checkAchievementUnlocks(userId: string) {
  try {
    const stats = await getUserStats(userId)
    const achievements = Object.entries(ACHIEVEMENT_CONFIG).map(([key, config]) => {
      const unlocked = config.condition(stats)
      return {
        id: key,
        name: config.name,
        unlocked
      }
    })

    // Get currently unlocked achievements for this user (if stored)
    // For now, we'll just calculate on-the-fly
    // If you want to persist unlock dates, you could store in database

    return achievements.filter(a => a.unlocked)
  } catch (error) {
    console.error('[ACHIEVEMENTS] Error checking unlocks:', error)
    return []
  }
}

export function getAchievementById(id: string) {
  return ACHIEVEMENT_CONFIG[id as keyof typeof ACHIEVEMENT_CONFIG] || null
}
