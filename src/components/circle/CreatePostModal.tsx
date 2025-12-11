'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreate: (post: any) => void
  bookId?: number
  bookTitle?: string
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreate,
  bookId,
  bookTitle
}: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Discussion')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Recommendation', 'Review', 'Quote', 'Discussion']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/circle/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          bookId: bookId || null,
          tags
        })
      })

      if (!res.ok) throw new Error('Failed to create post')
      
      const post = await res.json()
      setTitle('')
      setContent('')
      setCategory('Discussion')
      setTags([])
      setError('')
      onPostCreate(post)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-ghost rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-midnight/10 bg-ghost">
          <h2 className="text-2xl font-bold text-midnight">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-midnight/60 hover:text-midnight transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-midnight mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="What's your post about?"
              className="w-full px-4 py-3 rounded-lg border border-midnight/20 focus:border-accent focus:outline-none bg-white"
            />
            <p className="text-xs text-midnight/50 mt-1">{title.length}/200</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-midnight mb-2">
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    category === cat
                      ? 'bg-accent text-ghost'
                      : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Book Reference */}
          {bookTitle && (
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm text-midnight/60 mb-1">Referenced Book:</p>
              <p className="font-semibold text-midnight">{bookTitle}</p>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-midnight mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              placeholder="Share your thoughts, insights, or questions..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-midnight/20 focus:border-accent focus:outline-none resize-none bg-white"
            />
            <p className="text-xs text-midnight/50 mt-1">{content.length}/5000</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-midnight mb-2">
              Tags (up to 5)
            </label>
            <div className="flex gap-2 mb-3">
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-accent/60 hover:text-accent"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 rounded-lg border border-midnight/20 focus:border-accent focus:outline-none bg-white"
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={tags.length >= 5 || !tagInput.trim()}
                className="px-4 py-2 rounded-lg bg-midnight text-ghost font-semibold disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-midnight/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-midnight/20 text-midnight font-semibold hover:bg-midnight/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-accent text-ghost font-semibold disabled:opacity-50 hover:bg-accent/90 transition-colors"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
