'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiPlusCircle } from 'react-icons/hi2'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Post {
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
  viewCount: number
  createdAt: string
}

const categories = ['Recommendation', 'Review', 'Quote', 'Discussion']

export default function CirclePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchPosts()
    }
  }, [status, selectedCategory, page, router])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (selectedCategory) {
        params.append('category', selectedCategory)
      }

      const res = await fetch(`/api/circle/posts?${params}`)
      const data = await res.json()

      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-midnight/50">Loading...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-8 md:py-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-midnight">Circle</span>
            <span className="text-accent"> Forum</span>
          </h1>
          <p className="text-midnight/60">Share recommendations, reviews, and discuss books</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-ghost font-semibold"
        >
          <HiPlusCircle className="w-5 h-5" />
          <span>Create Post</span>
        </motion.button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-midnight text-ghost'
              : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
          }`}
        >
          All Posts
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-midnight text-ghost'
                : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-midnight/50">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-midnight/50 mb-4">No posts found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-accent hover:text-accent/80 font-semibold"
            >
              Be the first to post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/circle/posts/${post.id}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 rounded-xl border border-midnight/10 hover:border-accent/30 bg-ghost hover:bg-ghost/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-midnight mb-1 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                        {post.category}
                      </span>
                      <p className="text-sm text-midnight/60">
                        by {post.author.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-midnight/70 line-clamp-2 mb-4">{post.content}</p>

                <div className="flex items-center justify-between text-sm text-midnight/50">
                  <div className="flex gap-6">
                    <span>👍 {post.likeCount} likes</span>
                    <span>💬 {post.commentCount} comments</span>
                    <span>👁 {post.viewCount} views</span>
                  </div>
                  <span className="text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border border-midnight/10 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center px-4 py-2">
            Page {page} of {Math.ceil(total / 10)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 10)}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border border-midnight/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Post Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-ghost rounded-xl p-8 max-w-2xl w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <p className="text-midnight/60 mb-6">Modal content coming soon</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-2 rounded-lg bg-midnight text-ghost font-semibold"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
