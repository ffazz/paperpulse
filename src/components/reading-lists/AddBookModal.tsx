'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { HiXMark, HiMagnifyingGlass } from 'react-icons/hi2'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/hooks/useToast'

interface Book {
  id: number
  title: string
  authors: string[]
  cover_image_url?: string
}

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  listId: string
  onBookAdded?: () => void
}

export default function AddBookModal({
  isOpen,
  onClose,
  listId,
  onBookAdded,
}: AddBookModalProps) {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [note, setNote] = useState('')
  const [quote, setQuote] = useState('')
  const [adding, setAdding] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    searchBooks()
  }, [debouncedQuery])

  const searchBooks = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/books?search=${encodeURIComponent(debouncedQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      addToast('Failed to search books', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async () => {
    if (!selectedBook) return

    try {
      setAdding(true)
      const res = await fetch(`/api/user/lists/${listId}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBook.id,
          note: note || undefined,
          favoriteQuote: quote || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add book')
      }

      addToast('Book added to list!', 'success')
      setSearchQuery('')
      setSelectedBook(null)
      setNote('')
      setQuote('')
      onBookAdded?.()
      onClose()
    } catch (error) {
      console.error('Error:', error)
      addToast((error as Error).message || 'Failed to add book', 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Add Book to List</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>

                {/* Results */}
                {selectedBook ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Selected Book */}
                    <div className="flex gap-4 p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl">
                      {selectedBook.cover_image_url && (
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={selectedBook.cover_image_url}
                            alt={selectedBook.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{selectedBook.title}</h3>
                        {selectedBook.authors.length > 0 && (
                          <p className="text-sm text-gray-600">
                            {selectedBook.authors.join(', ')}
                          </p>
                        )}
                        <button
                          onClick={() => setSelectedBook(null)}
                          className="mt-2 text-sm text-accent hover:text-accent/80 font-medium"
                        >
                          Choose different book
                        </button>
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Personal Note (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value.slice(0, 2000))}
                        placeholder="Add your thoughts about this book..."
                        rows={3}
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
                        Favorite Quote (optional)
                      </label>
                      <textarea
                        value={quote}
                        onChange={(e) => setQuote(e.target.value.slice(0, 1000))}
                        placeholder="Your favorite quote from this book..."
                        rows={2}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none resize-none"
                        maxLength={1000}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {quote.length}/1000 characters
                      </p>
                    </div>
                  </motion.div>
                ) : loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-accent rounded-full animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  <motion.div className="grid grid-cols-2 gap-3">
                    {results.map((book) => (
                      <motion.button
                        key={book.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedBook(book)}
                        className="text-left p-3 border rounded-xl hover:border-accent hover:bg-gray-50 transition-all group"
                      >
                        {book.cover_image_url && (
                          <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-gray-200">
                            <Image
                              src={book.cover_image_url}
                              alt={book.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold line-clamp-2 text-sm">
                          {book.title}
                        </h3>
                        {book.authors.length > 0 && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {book.authors[0]}
                          </p>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : searchQuery ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No books found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Search for a book to get started</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {selectedBook && (
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBook}
                    disabled={adding}
                    className="flex-1 px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add to List'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
