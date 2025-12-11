import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalBooks = await prisma.book.count()
    
    const indonesianBooks = await prisma.book.count({
      where: { language: 'Indonesian' }
    })
    
    const englishBooks = await prisma.book.count({
      where: { language: 'English' }
    })
    
    const topViewedBooks = await prisma.book.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        authors: true,
        viewCount: true,
      }
    })
    
    const recentBooks = await prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        authors: true,
        publication_date: true,
      }
    })

    return NextResponse.json({
      totalBooks,
      indonesianBooks,
      englishBooks,
      topViewedBooks,
      recentBooks,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}