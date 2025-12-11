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
    const currentUserId = session?.user?.id

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        twitter: true,
        instagram: true,
        goodreads: true,
        favoriteGenres: true,
        isPublic: true,
        showEmail: true,
        showReadingGoal: true,
        coverImage: true,
        theme: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check privacy settings
    if (!user.isPublic && currentUserId !== userId) {
      return NextResponse.json(
        { error: 'This profile is private' },
        { status: 403 }
      )
    }

    // Hide email unless showEmail is true or viewer is owner
    const userData = {
      ...user,
      email: (user.showEmail || currentUserId === userId) ? user.email : null
    }

    // Record profile view if viewer is authenticated
    if (currentUserId && currentUserId !== userId) {
      await prisma.profileView.create({
        data: {
          profileUserId: userId,
          viewerUserId: currentUserId
        }
      }).catch(() => {
        // Silently fail if view recording fails
      })
    }

    // Fetch user statistics
    const [
      totalBooksRead,
      totalLists,
      totalPosts,
      totalReviews,
      profileViews,
      currentGoal,
      currentYearActivities
    ] = await Promise.all([
      // Total books completed in all goals
      prisma.readingGoalBook.count({
        where: { 
          goal: { userId },
          status: 'completed'
        }
      }),
      // Total reading lists
      prisma.readingList.count({
        where: { userId }
      }),
      // Total Circle posts
      prisma.post.count({
        where: { authorId: userId }
      }),
      // Total reviews (books with ratings in goal books)
      prisma.readingGoalBook.count({
        where: {
          goal: { userId },
          rating: { not: null }
        }
      }),
      // Profile views (only if own profile)
      currentUserId === userId 
        ? prisma.profileView.count({ where: { profileUserId: userId } })
        : Promise.resolve(0),
      // Current year reading goal
      prisma.readingGoal.findUnique({
        where: {
          userId_year: {
            userId,
            year: new Date().getFullYear()
          }
        }
      }),
      // Get activities this year for streak calculation
      prisma.userActivity.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1)
          }
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' }
      })
    ])

    // Calculate reading streak
    let readingStreak = 0
    let longestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    currentYearActivities.forEach((activity) => {
      if (!lastDate) {
        currentStreak = 1
        lastDate = activity.createdAt
      } else {
        const diff = Math.floor(
          (lastDate.getTime() - activity.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diff === 1) {
          currentStreak++
        } else if (diff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak)
          currentStreak = 1
        }
        lastDate = activity.createdAt
      }
    })
    longestStreak = Math.max(longestStreak, currentStreak)
    readingStreak = currentStreak

    const stats = {
      totalBooksRead,
      totalLists,
      totalPosts,
      totalReviews,
      profileViews: currentUserId === userId ? profileViews : undefined,
      readingStreak,
      longestStreak
    }

    // Build current goal response
    const currentGoalResponse = currentGoal && user.showReadingGoal ? {
      year: currentGoal.year,
      targetBooks: currentGoal.targetBooks,
      currentBooks: currentGoal.currentBooks,
      inProgressBooks: await prisma.readingGoalBook.count({
        where: { goalId: currentGoal.id, status: 'reading' }
      }),
      percentage: Math.round((currentGoal.currentBooks / currentGoal.targetBooks) * 100)
    } : null

    // Calculate achievements
    const achievements = await calculateAchievements(userId, totalBooksRead, totalPosts, totalReviews, currentGoal)

    return NextResponse.json({
      user: userData,
      stats,
      currentGoal: currentGoalResponse,
      achievements
    })
  } catch (error) {
    console.error('[PROFILE_API] Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    const { userId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      name,
      bio,
      location,
      website,
      twitter,
      instagram,
      goodreads,
      favoriteGenres,
      isPublic,
      showEmail,
      showReadingGoal,
      theme
    } = body

    // Validation
    if (name && name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be max 50 characters' },
        { status: 400 }
      )
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be max 500 characters' },
        { status: 400 }
      )
    }

    if (location && location.length > 100) {
      return NextResponse.json(
        { error: 'Location must be max 100 characters' },
        { status: 400 }
      )
    }

    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: 'Website must be a valid URL' },
        { status: 400 }
      )
    }

    if (favoriteGenres && favoriteGenres.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 favorite genres allowed' },
        { status: 400 }
      )
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(twitter !== undefined && { twitter }),
        ...(instagram !== undefined && { instagram }),
        ...(goodreads !== undefined && { goodreads }),
        ...(favoriteGenres !== undefined && { favoriteGenres }),
        ...(isPublic !== undefined && { isPublic }),
        ...(showEmail !== undefined && { showEmail }),
        ...(showReadingGoal !== undefined && { showReadingGoal }),
        ...(theme !== undefined && { theme })
      }
    })

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
      bio: updated.bio,
      location: updated.location,
      website: updated.website,
      twitter: updated.twitter,
      instagram: updated.instagram,
      goodreads: updated.goodreads,
      favoriteGenres: updated.favoriteGenres,
      isPublic: updated.isPublic,
      showEmail: updated.showEmail,
      showReadingGoal: updated.showReadingGoal,
      theme: updated.theme
    })
  } catch (error) {
    console.error('[PROFILE_API] Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function calculateAchievements(
  userId: string,
  totalBooksRead: number,
  totalPosts: number,
  totalReviews: number,
  currentGoal: any
) {
  const achievements = [
    {
      id: 'bookworm',
      name: 'Bookworm',
      icon: '📚',
      unlocked: totalBooksRead >= 10
    },
    {
      id: 'voracious_reader',
      name: 'Voracious Reader',
      icon: '🔥',
      unlocked: totalBooksRead >= 50
    },
    {
      id: 'century_club',
      name: 'Century Club',
      icon: '💯',
      unlocked: totalBooksRead >= 100
    },
    {
      id: 'goal_crusher',
      name: 'Goal Crusher',
      icon: '🏆',
      unlocked: currentGoal?.currentBooks >= currentGoal?.targetBooks
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      icon: '🦋',
      unlocked: totalPosts >= 10
    },
    {
      id: 'critic',
      name: 'Critic',
      icon: '⭐',
      unlocked: totalReviews >= 20
    },
    {
      id: 'curator',
      name: 'Curator',
      icon: '📖',
      unlocked: (await prisma.readingList.count({ where: { userId } })) >= 5
    }
  ]

  return achievements
}
