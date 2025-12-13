'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiHeart, HiChatBubbleLeftRight } from 'react-icons/hi2'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  category: string
  author: {
    id: string
    name: string | null
    image: string | null
    bio?: string
  }
  book?: {
    id: number
    title: string
    cover_image_url?: string
  }
  likeCount: number
  commentCount: number
  viewCount: number
  isLiked?: boolean
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: string
  replies?: Comment[]
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const postId = params.postId as string

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchPost()
    }
  }, [status, router])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/circle/posts/${postId}`)
      if (!res.ok) throw new Error('Failed to fetch post')
      const data = await res.json()
      setPost(data)
      setIsLiked(data.isLiked || false)
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/circle/posts/${postId}/likes`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('Failed to toggle like')
      const data = await res.json()
      setIsLiked(data.liked)
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session?.user?.id) return

    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/circle/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      })
      if (!res.ok) throw new Error('Failed to create comment')
      
      setCommentText('')
      // Refresh post to show new comment
      await fetchPost()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-midnight/50">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <p className="text-midnight/50 mb-4">Post not found</p>
        <Link href="/circle" className="text-accent hover:text-accent/80 font-semibold">
          Back to Circle
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container pt-20 md:pt-24 pb-8 md:pb-12"
    >
      {/* Back Button */}
      <Link href="/circle">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-accent hover:text-accent/80 mb-6"
        >
          <HiArrowLeft className="w-5 h-5" />
          Back to Circle
        </motion.button>
      </Link>

      {/* Post Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-ghost rounded-xl p-8 border border-midnight/10 mb-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-midnight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-midnight/60">
              <span>by {post.author.name || 'Anonymous'}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8 text-midnight">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Book Reference */}
        {post.book && (
          <div className="p-4 rounded-lg bg-midnight/5 border border-midnight/10 mb-8">
            <p className="text-sm text-midnight/60 mb-2">Referenced Book:</p>
            <p className="font-semibold text-midnight">{post.book.title}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-8 border-t border-midnight/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-accent/10 text-accent'
                : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
            }`}
          >
            <HiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </motion.button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight/5 text-midnight">
            <HiChatBubbleLeftRight className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight">Comments</h2>

        {/* Comment Input */}
        <form onSubmit={handleComment} className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-midnight/20 focus:border-accent focus:outline-none resize-none bg-ghost"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="px-6 py-2 rounded-lg bg-accent text-ghost font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-ghost border border-midnight/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-midnight">{comment.author.name || 'Anonymous'}</p>
                  <p className="text-xs text-midnight/60">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-midnight/70">{comment.content}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center py-8 text-midnight/50">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
