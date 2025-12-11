'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'

interface CreateListModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateListModal({ isOpen, onClose, onSuccess }: CreateListModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('List name is required')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/user/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create list')
      }

      setName('')
      setDescription('')
      setIsPublic(false)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create list')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-midnight">Create Reading List</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <HiXMark className="w-6 h-6 text-midnight/60" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-midnight mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 100))}
                  placeholder="e.g., Summer Reads 2025"
                  className="w-full px-4 py-3 rounded-xl border border-midnight/10 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <p className="text-xs text-midnight/40 mt-1">{name.length}/100</p>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-midnight mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  placeholder="What's this list about?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-midnight/10 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-none"
                  disabled={loading}
                />
                <p className="text-xs text-midnight/40 mt-1">{description.length}/500</p>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-accent"
                  disabled={loading}
                />
                <label className="flex-1 cursor-pointer">
                  <p className="text-sm font-semibold text-midnight">Make this list public</p>
                  <p className="text-xs text-midnight/60">Others can view and share your list</p>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-midnight/10 text-midnight rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-accent to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
