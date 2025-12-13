'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { useToast } from '@/hooks/useToast'

interface BookNoteEditorProps {
  isOpen: boolean
  onClose: () => void
  listId: string
  bookId: number
  bookTitle: string
  initialNote?: string
  initialQuote?: string
  onSaved?: () => void
}

export default function BookNoteEditor({
  isOpen,
  onClose,
  listId,
  bookId,
  bookTitle,
  initialNote = '',
  initialQuote = '',
  onSaved,
}: BookNoteEditorProps) {
  const { addToast } = useToast()
  const [note, setNote] = useState(initialNote)
  const [quote, setQuote] = useState(initialQuote)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch(
        `/api/user/lists/${listId}/books/${bookId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note: note || undefined,
            favoriteQuote: quote || undefined,
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to save')

      addToast('Notes saved!', 'success')
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Error:', error)
      addToast('Failed to save notes', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">Edit Notes</h2>
                  <p className="text-sm text-gray-600 mt-1">{bookTitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Personal Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 2000))}
                    placeholder="Your thoughts about this book..."
                    rows={4}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none resize-none"
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {note.length}/2000 characters
                  </p>
                </div>

                {/* Quote */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Favorite Quote
                  </label>
                  <textarea
                    value={quote}
                    onChange={(e) => setQuote(e.target.value.slice(0, 1000))}
                    placeholder="Your favorite quote from this book..."
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {quote.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
