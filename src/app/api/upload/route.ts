import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CSVParser } from '@/lib/csv-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const books = await CSVParser.parseCSV(file)

    const createdBooks = await prisma.book.createMany({
      data: books,
      skipDuplicates: true,
    })

    return NextResponse.json({
      message: 'Books uploaded successfully',
      count: createdBooks.count,
    })
  } catch (error) {
    console.error('Error uploading books:', error)
    return NextResponse.json({ error: 'Failed to upload books' }, { status: 500 })
  }
}
