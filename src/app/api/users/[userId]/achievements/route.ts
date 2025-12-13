import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ACHIEVEMENT_CONFIG, getUserStats } from '@/lib/achievements'

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

    // Get user statistics using the utility function
    const stats = await getUserStats(userId)

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
