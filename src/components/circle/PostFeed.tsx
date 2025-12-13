'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiHeart, HiChatBubbleLeftRight, HiEye } from 'react-icons/hi2'

interface PostFeedProps {
  posts: Array<{
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
  }>
  loading?: boolean
  onPostSelect?: (postId: string) => void
}

export default function PostFeed({ posts, loading = false, onPostSelect }: PostFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-ghost border border-midnight/10 animate-pulse">
            <div className="h-6 bg-midnight/10 rounded w-3/4 mb-3" />
            <div className="h-4 bg-midnight/10 rounded w-full mb-2" />
            <div className="h-4 bg-midnight/10 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-midnight/50 mb-4">No posts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Link href={`/circle/posts/${post.id}`}>
            <motion.div
              whileHover={{ y: -2 }}
              onClick={() => onPostSelect?.(post.id)}
              className="p-6 rounded-xl border border-midnight/10 hover:border-accent/30 bg-ghost hover:bg-ghost/50 transition-all cursor-pointer group"
            >
              {/* Category and Author */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                  {post.category}
                </span>
                <p className="text-sm text-midnight/60">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-midnight mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Author */}
              <p className="text-sm text-midnight/60 mb-3">
                by {post.author.name || 'Anonymous'}
              </p>

              {/* Content Preview */}
              <p className="text-midnight/70 line-clamp-2 mb-4">
                {post.content}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 md:gap-6 text-sm text-midnight/50 pt-4 border-t border-midnight/10">
                <div className="flex items-center gap-2 hover:text-accent transition-colors">
                  <HiHeart className="w-4 h-4" />
                  <span>{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-accent transition-colors">
                  <HiChatBubbleLeftRight className="w-4 h-4" />
                  <span>{post.commentCount}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-accent transition-colors">
                  <HiEye className="w-4 h-4" />
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
