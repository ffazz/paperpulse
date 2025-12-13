'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiHeart, HiArrowUturnLeft } from 'react-icons/hi2'

interface CommentProps {
  id: string
  content: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  likeCount?: number
  isLiked?: boolean
  createdAt: string
  replies?: CommentProps[]
  onReply?: (commentId: string, content: string) => void
  depth?: number
}

export default function Comment({
  id,
  content,
  author,
  likeCount = 0,
  isLiked = false,
  createdAt,
  replies = [],
  onReply,
  depth = 0
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [liked, setLiked] = useState(isLiked)
  const [likeCounter, setLikeCounter] = useState(likeCount)

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    try {
      setIsSubmittingReply(true)
      onReply?.(id, replyText)
      setReplyText('')
      setShowReplyForm(false)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCounter(prev => liked ? prev - 1 : prev + 1)
  }

  const isReply = depth && depth > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-4 md:ml-8 border-l-2 border-midnight/10 pl-4 md:pl-6' : ''}`}
    >
      {/* Comment Container */}
      <div className="p-4 rounded-lg bg-ghost border border-midnight/10 hover:border-midnight/20 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-midnight">{author.name || 'Anonymous'}</p>
            <p className="text-xs text-midnight/50">
              {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-midnight/80 mb-4 text-sm md:text-base">{content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              liked
                ? 'text-accent'
                : 'text-midnight/50 hover:text-midnight'
            }`}
          >
            <HiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likeCounter}</span>
          </button>

          {depth === undefined || depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 text-midnight/50 hover:text-midnight transition-colors"
            >
              <HiArrowUturnLeft className="w-4 h-4" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleReply}
            className="mt-4 pt-4 border-t border-midnight/10 space-y-3"
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-accent focus:outline-none resize-none text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmittingReply}
                className="px-4 py-2 rounded-lg bg-accent text-ghost text-sm font-semibold disabled:opacity-50"
              >
                {isSubmittingReply ? 'Replying...' : 'Reply'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReplyForm(false)
                  setReplyText('')
                }}
                className="px-4 py-2 rounded-lg border border-midnight/20 text-midnight text-sm font-semibold hover:bg-midnight/5"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Replies */}
      {replies && replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              {...reply}
              depth={(depth || 0) + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
