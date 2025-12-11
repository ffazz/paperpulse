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

    // Validate file size (5MB max for avatar)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // In production, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // For now, we'll return a placeholder URL
    // Example: const url = await uploadToCloudinary(file)
    
    const fileName = `${userId}-avatar-${Date.now()}`
    const url = `/uploads/avatars/${fileName}`

    // Update user with new avatar URL
    const user = await prisma.user.update({
      where: { id: userId },
      data: { image: url }
    })

    return NextResponse.json({
      success: true,
      url: user.image,
      message: 'Avatar uploaded successfully'
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
