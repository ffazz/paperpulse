'use client'

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'

interface UserProfile {
  user: {
    id: string
    name: string | null
    image: string | null
    bio: string | null
    createdAt: string
    stats: {
      totalPosts: number
      totalComments: number
      totalLikes: number
      totalCommentLikes: number
    }
  }
  recentPosts: Array<{
    id: string
    title: string
    createdAt: string
    likeCount: number
    commentCount: number
  }>
  favoriteBooks: Array<{
    id: number
    title: string
    authors: string[]
    cover_image_url: string | null
  }>
}

export default function UserProfilePage({
  params
}: {
  params: Promise<{ userId: string }>
}) {
  const router = useRouter()
  const { userId } = use(params)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/circle/users/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container pt-24 pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container pt-24 pb-12 text-center">
        <p className="text-midnight/50 mb-4">User not found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-accent text-ghost rounded-lg hover:bg-accent/90"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { user, recentPosts, favoriteBooks } = profile

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container pt-24 pb-12"
    >
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-accent hover:text-accent/80 mb-8"
      >
        <HiArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Profile Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-8 mb-8"
      >
        <div className="flex items-start gap-6 mb-6">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name || 'Anonymous'}</h1>
            {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}
            <p className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-accent/5">
            <div className="text-2xl font-bold text-accent">
              {user.stats.totalPosts}
            </div>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">
              {user.stats.totalComments}
            </div>
            <p className="text-sm text-gray-600">Comments</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="text-2xl font-bold text-red-600">
              {user.stats.totalLikes}
            </div>
            <p className="text-sm text-gray-600">Post Likes</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50">
            <div className="text-2xl font-bold text-purple-600">
              {user.stats.totalCommentLikes}
            </div>
            <p className="text-sm text-gray-600">Comment Likes</p>
          </div>
        </div>
      </motion.div>

      {/* Favorite Books */}
      {favoriteBooks.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Favorite Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {book.cover_image_url ? (
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-4xl">
                      📚
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {book.authors.join(', ')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/circle/posts/${post.id}`}>
                <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
