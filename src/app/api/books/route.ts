import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FilterOptions } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters: FilterOptions = {
      search: searchParams.get('search') || undefined,
      genre: searchParams.get('genre') || undefined,
      language: searchParams.get('language') || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      maxRating: searchParams.get('maxRating') ? parseFloat(searchParams.get('maxRating')!) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'rating',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }

    const where: any = {}

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { author: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.genre) {
      where.genre = filters.genre
    }

    if (filters.language) {
      where.language = filters.language
    }

    if (filters.minRating !== undefined || filters.maxRating !== undefined) {
      where.rating = {}
      if (filters.minRating !== undefined) where.rating.gte = filters.minRating
      if (filters.maxRating !== undefined) where.rating.lte = filters.maxRating
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: {
        [filters.sortBy || 'rating']: filters.sortOrder || 'desc',
      },
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        genre: body.genre,
        rating: body.rating,
        vibes: body.vibes,
        themes: body.themes,
        pages: body.pages,
        year: body.year,
        language: body.language || 'English',
      },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
