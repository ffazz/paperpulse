import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    const { userId } = await params

    // Check if profile is public or user is owner
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.isPublic && session?.user?.id !== userId) {
      return NextResponse.json(
        { error: 'This profile is private' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type') // optional filter
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null

    // Build where clause
    const where: any = {
      userId,
      isPublic: true // Only return public activities for non-owners
    }

    // If viewing own profile, include private activities
    if (session?.user?.id === userId) {
      delete where.isPublic
    }

    if (type) {
      where.type = type
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    // Fetch activities with pagination
    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.userActivity.count({ where })
    ])

    return NextResponse.json({
      activities,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('[ACTIVITY_API] Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
