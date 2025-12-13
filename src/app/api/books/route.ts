import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const languageFilter = searchParams.get('language')
    const subjectFilter = searchParams.get('subject')
    const publisherFilter = searchParams.get('publisher')
    const searchQuery = searchParams.get('search')
    const yearFrom = searchParams.get('yearFrom')
    const yearTo = searchParams.get('yearTo')

    console.log('🔍 API Request Filters:', {
      language: languageFilter,
      subject: subjectFilter,
      publisher: publisherFilter,
      search: searchQuery,
      yearFrom,
      yearTo
    })

    // Build where clause dynamically
    const where: any = {}

    // Language Filter
    if (languageFilter) {
      where.language = languageFilter
    }

    // Subject Filter
    if (subjectFilter) {
      where.subjects = {
        has: subjectFilter
      }
    }

    // Publisher Filter
    if (publisherFilter) {
      where.publisher = publisherFilter
    }

    // Search Query Filter
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { publisher: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }

    // Year Range Filter
    if (yearFrom || yearTo) {
      where.publication_date = {}
      
      if (yearFrom) {
        where.publication_date.gte = new Date(`${yearFrom}-01-01`)
      }
      
      if (yearTo) {
        where.publication_date.lte = new Date(`${yearTo}-12-31`)
      }
    }

    console.log('🔍 Prisma where clause:', JSON.stringify(where, null, 2))

    // Fetch books with filters
    const books = await prisma.book.findMany({
      where,
      take: 1000,
      orderBy: { id: 'asc' }
    })

    console.log(`✅ Found ${books.length} books`)

    return NextResponse.json(books)

  } catch (error) {
    console.error('❌ API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch books',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
