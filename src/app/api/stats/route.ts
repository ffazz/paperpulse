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
    
    const topRatedBooks = await prisma.book.findMany({
      take: 5,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        rating: true,
      }
    })
    
    const recentBooks = await prisma.book.findMany({
      take: 5,
      orderBy: { year: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        year: true,
      }
    })

    const genreCount = await prisma.book.groupBy({
      by: ['genre'],
      _count: true,
    })

    return NextResponse.json({
      totalBooks,
      indonesianBooks,
      englishBooks,
      topRatedBooks,
      recentBooks,
      genreCount,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}