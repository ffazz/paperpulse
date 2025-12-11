import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const bookId = parseInt(resolvedParams.id)
    
    await prisma.book.update({
      where: { id: bookId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
