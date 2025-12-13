import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (10MB max for cover)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // In production, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // and resize to 1200x300px
    // Example: const url = await uploadAndResizeToCloudinary(file, 1200, 300)
    
    const fileName = `${userId}-cover-${Date.now()}`
    const url = `/uploads/covers/${fileName}`

    // Update user with new cover image URL
    const user = await prisma.user.update({
      where: { id: userId },
      data: { coverImage: url }
    })

    return NextResponse.json({
      success: true,
      url: user.coverImage,
      message: 'Cover image uploaded successfully'
    })
  } catch (error) {
    console.error('Cover upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload cover image' },
      { status: 500 }
    )
  }
}
