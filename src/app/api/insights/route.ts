import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DatasetInsights } from '@/types'

export async function GET() {
  try {
    const books = await prisma.book.findMany()

    if (books.length === 0) {
      return NextResponse.json({
        totalBooks: 0,
        averageRating: 0,
        averagePages: 0,
        genreDistribution: {},
        vibesFrequency: {},
        themesFrequency: {},
        languageDistribution: {},
        yearRange: { min: 0, max: 0 },
        ratingDistribution: {},
      })
    }

    const totalBooks = books.length
    const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / totalBooks
    const averagePages = books.reduce((sum, book) => sum + book.pages, 0) / totalBooks

    const genreDistribution: Record<string, number> = {}
    const vibesFrequency: Record<string, number> = {}
    const themesFrequency: Record<string, number> = {}
    const languageDistribution: Record<string, number> = {}
    const ratingDistribution: Record<string, number> = {
      '4.0-4.2': 0,
      '4.2-4.4': 0,
      '4.4-4.6': 0,
      '4.6-4.8': 0,
      '4.8-5.0': 0,
    }

    let minYear = Infinity
    let maxYear = -Infinity

    books.forEach(book => {
      genreDistribution[book.genre] = (genreDistribution[book.genre] || 0) + 1

      book.vibes.forEach(vibe => {
        vibesFrequency[vibe] = (vibesFrequency[vibe] || 0) + 1
      })

      book.themes.forEach(theme => {
        themesFrequency[theme] = (themesFrequency[theme] || 0) + 1
      })

      languageDistribution[book.language] = (languageDistribution[book.language] || 0) + 1

      if (book.year < minYear) minYear = book.year
      if (book.year > maxYear) maxYear = book.year

      if (book.rating >= 4.0 && book.rating < 4.2) ratingDistribution['4.0-4.2']++
      else if (book.rating >= 4.2 && book.rating < 4.4) ratingDistribution['4.2-4.4']++
      else if (book.rating >= 4.4 && book.rating < 4.6) ratingDistribution['4.4-4.6']++
      else if (book.rating >= 4.6 && book.rating < 4.8) ratingDistribution['4.6-4.8']++
      else if (book.rating >= 4.8) ratingDistribution['4.8-5.0']++
    })

    const insights: DatasetInsights = {
      totalBooks,
      averageRating,
      averagePages,
      genreDistribution,
      vibesFrequency,
      themesFrequency,
      languageDistribution,
      yearRange: { min: minYear, max: maxYear },
      ratingDistribution,
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
