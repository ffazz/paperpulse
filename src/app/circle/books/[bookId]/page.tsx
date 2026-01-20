'use client'

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'

interface BookPost {
  id: string
  title: string
  content: string
  category: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  likeCount: number
  commentCount: number
  createdAt: string
}

interface BookWithPosts {
  posts: BookPost[]
  total: number
  page: number
  pages: number
  book: {
    id: number
    title: string
    authors: string[]
    cover_image_url: string | null
  }
}

export default function BookPostsPage({
  params
}: {
  params: Promise<{ bookId: string }>
}) {
  const router = useRouter()
  const { bookId } = use(params)
  const [data, setData] = useState<BookWithPosts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  const fetchBookPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/circle/books/${bookId}/posts?limit=20&page=1`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      const fetchedData = await res.json()
      setData(fetchedData)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container pt-24 pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container pt-24 pb-12 text-center">
        <p className="text-midnight/50 mb-4">Book not found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-accent text-ghost rounded-lg hover:bg-accent/90"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { book, posts } = data

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

      {/* Book Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-8 mb-8"
      >
        <div className="flex gap-6 items-start">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              width={150}
              height={225}
              className="rounded-2xl"
            />
          ) : (
            <div className="w-24 h-32 bg-gray-200 rounded-2xl flex items-center justify-center text-4xl">
              📚
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-6">{book.authors.join(', ')}</p>
            <div className="flex gap-4">
              <Link href={`/books/${book.id}`}>
                <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90">
                  View Book
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts */}
      <h2 className="text-2xl font-bold mb-4">
        Discussions ({data.total})
      </h2>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No discussions yet</p>
          <Link href="/circle">
            <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90">
              Start a Discussion
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(`/circle/posts/${post.id}`)}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg mb-1 line-clamp-2 flex-1">
                  {post.title}
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent ml-4 shrink-0">
                  {post.category}
                </span>
              </div>

              <p className="text-gray-600 line-clamp-2 mb-3">
                {post.content}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <Link
                  href={`/circle/users/${post.author.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 hover:text-accent"
                >
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/10">👤</div>
                  )}
                  <span>{post.author.name || 'Anonymous'}</span>
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-4">
                <span className="text-sm">❤️ {post.likeCount}</span>
                <span className="text-sm">💬 {post.commentCount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
