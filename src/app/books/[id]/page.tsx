'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Book } from '@/types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import RecommendationSection from '@/components/books/RecommendationSection'
import { ToastContainer } from '@/components/ui/Toast'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useToast } from '@/hooks/useToast'
import { HiPlus } from 'react-icons/hi2'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { favoriteIds, addBookmark, removeBookmark } = useBookmarks()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [userLists, setUserLists] = useState<{ id: string; name: string }[]>([])
  const [showListDropdown, setShowListDropdown] = useState(false)

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/books/${params.id}`, {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }
        
        const data = await response.json()
        setBook(data)

        // Track view in background
        fetch(`/api/books/${params.id}/view`, {
          method: 'POST',
          cache: 'no-store'
        }).catch(() => {})
      } catch (err) {
        console.error('Failed to load book:', err)
        setError('Failed to load book details.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBook()
    }
  }, [params.id])

  // Update favorite status when book or favoriteIds changes
  useEffect(() => {
    if (book && favoriteIds.has(book.id)) {
      setIsFavorite(true)
    } else {
      setIsFavorite(false)
    }
  }, [book, favoriteIds])

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (!book) return

    setIsBookmarking(true)
    try {
      if (isFavorite) {
        const result = await removeBookmark(book.id)
        if (result) {
          showError(`Removed "${book.title}" from favorites`)
        } else {
          showError('Failed to remove from favorites')
        }
      } else {
        const result = await addBookmark(book.id)
        if (result) {
          success(`Successfully added "${book.title}" to favorites`)
        } else {
          showError('Failed to add to favorites')
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      showError('An error occurred while updating favorites')
    } finally {
      setIsBookmarking(false)
    }
  }

  const fetchUserLists = async () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    try {
      const res = await fetch('/api/user/lists')
      if (res.ok) {
        const data = await res.json()
        setUserLists(data)
      }
    } catch (err) {
      console.error('Error fetching lists:', err)
    }
  }

  const handleAddToList = async (listId: string) => {
    if (!book) return

    try {
      const res = await fetch(`/api/user/lists/${listId}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id }),
      })

      if (res.ok) {
        success(`Added "${book.title}" to list!`)
        setShowListDropdown(false)
      } else {
        const data = await res.json()
        showError(data.error || 'Failed to add to list')
      }
    } catch (err) {
      console.error('Error:', err)
      showError('Failed to add to list')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-accent mx-auto mb-4"></div>
            <p className="text-base md:text-lg lg:text-xl font-semibold text-midnight">Loading book details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center h-screen px-4">
          <div className="text-center max-w-md mx-auto p-4 md:p-8 bg-white rounded-lg md:rounded-xl shadow-lg">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">😞</div>
            <h2 className="text-lg md:text-2xl font-bold text-midnight mb-3 md:mb-4">Book Not Found</h2>
            <p className="text-sm md:text-base text-midnight/60 mb-4 md:mb-6">{error || 'The book you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/books')}
              className="px-4 md:px-6 py-2 md:py-3 bg-accent text-white text-sm md:text-base rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              Back to Books
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isIndonesian = book.language?.toLowerCase().includes('indonesia') || 
                       book.language?.toLowerCase().includes('indonesian') ||
                       book.language === 'id'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-4 md:py-8 mt-14 md:mt-16 lg:mt-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/books')}
          className="mb-4 md:mb-6 flex items-center gap-2 text-accent hover:text-accent/80 text-sm md:text-base font-semibold transition-colors"
        >
          ← Back to Books
        </motion.button>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-16 md:top-20 lg:top-24">
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg md:rounded-xl overflow-hidden shadow-xl">
                  {!imageError && book.cover_image_url ? (
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
                      <div className="text-center p-4 md:p-6">
                        <div className="text-6xl md:text-8xl mb-2 md:mb-4">📚</div>
                        <p className="text-xs md:text-lg text-midnight/60 font-medium">
                          {book.title}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 md:top-4 right-2 md:right-4">
                    <span className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg backdrop-blur-sm ${
                      isIndonesian 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-blue-500/90 text-white'
                    }`}>
                      {isIndonesian ? '🇮🇩 Indonesian' : '🌍 International'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
                  {book.publication_date && (
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg md:text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-midnight/50 font-semibold">Published</p>
                        <p className="text-xs md:text-sm font-bold text-midnight">
                          {new Date(book.publication_date).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}

                  {book.epub_isbn && (
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg md:text-2xl">🔖</span>
                      <div>
                        <p className="text-xs text-midnight/50 font-semibold">ISBN</p>
                        <p className="text-xs md:text-sm font-mono font-bold text-midnight">{book.epub_isbn}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg md:text-2xl">🆔</span>
                    <div>
                      <p className="text-xs text-midnight/50 font-semibold">Book ID</p>
                      <p className="text-xs md:text-sm font-mono font-bold text-midnight">#{book.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-start justify-between gap-4 mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight leading-tight flex-1">
                  {book.title}
                </h1>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <motion.button
                    onClick={handleToggleFavorite}
                    disabled={isBookmarking}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isFavorite
                        ? 'bg-accent text-white shadow-lg'
                        : 'bg-gray-100 text-midnight hover:bg-gray-200'
                    } ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isBookmarking ? (
                      <span>...</span>
                    ) : isFavorite ? (
                      <span className="text-sm md:text-base">❤️ Favorited</span>
                    ) : (
                      <span className="text-sm md:text-base">🤍 Add to Favorite</span>
                    )}
                  </motion.button>

                  {session?.user && (
                    <div className="relative">
                      <motion.button
                        onClick={() => {
                          setShowListDropdown(!showListDropdown)
                          if (!showListDropdown && userLists.length === 0) {
                            fetchUserLists()
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 bg-gray-100 text-midnight hover:bg-gray-200 flex items-center justify-center gap-2"
                      >
                        <HiPlus className="w-4 h-4" />
                        <span className="text-sm md:text-base">Add to List</span>
                      </motion.button>

                      {showListDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200"
                        >
                          {userLists.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500 text-center">
                              No lists yet. Create one to get started!
                            </p>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              {userLists.map((list) => (
                                <button
                                  key={list.id}
                                  onClick={() => handleAddToList(list.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                                >
                                  {list.name}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="border-t px-4 py-2">
                            <button
                              onClick={() => router.push('/reading-lists')}
                              className="w-full text-center text-sm text-accent hover:text-accent/80 font-semibold"
                            >
                              Manage Lists
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {book.authors && book.authors.length > 0 && (
                <div className="mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-lg md:text-2xl">✍️</span>
                    <div>
                      <p className="text-xs md:text-sm text-midnight/50 font-semibold mb-1">Author(s)</p>
                      <p className="text-sm md:text-base lg:text-lg text-midnight font-medium">
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-lg md:text-2xl">📚</span>
                    <div>
                      <p className="text-xs md:text-sm text-midnight/50 font-semibold mb-1">Publisher</p>
                      <p className="text-sm md:text-base lg:text-lg text-midnight font-medium">{book.publisher}</p>
                    </div>
                  </div>
                </div>
              )}

              {book.description && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-2xl font-bold text-midnight mb-3 md:mb-4 flex items-center gap-2">
                    📝 Description
                  </h2>
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <p className="text-xs md:text-sm lg:text-base text-midnight/70 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>
              )}

              {book.subjects && book.subjects.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-2xl font-bold text-midnight mb-3 md:mb-4 flex items-center gap-2">
                    🏷️ Subjects & Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {book.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 md:px-4 py-1 md:py-2 bg-accent/10 text-accent rounded text-xs md:text-sm font-medium hover:bg-accent/20 transition-colors"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {book && (
          <div className="mt-12 md:mt-16">
            <RecommendationSection bookId={book.id} />
          </div>
        )}
      </main>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
