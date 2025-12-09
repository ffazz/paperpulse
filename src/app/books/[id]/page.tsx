'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Book } from '@/types'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/books/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }
        
        const data = await response.json()
        setBook(data)
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-midnight">Loading book details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-midnight mb-4">Book Not Found</h2>
            <p className="text-midnight/60 mb-6">{error || 'The book you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/books')}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold"
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
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/books')}
          className="mb-6 flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
        >
          ← Back to Books
        </motion.button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Book Cover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <div className="relative h-[500px] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden shadow-xl">
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
                      <div className="text-center p-6">
                        <div className="text-8xl mb-4">📚</div>
                        <p className="text-lg text-midnight/60 font-medium">
                          {book.title}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Language Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
                      isIndonesian 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-blue-500/90 text-white'
                    }`}>
                      {isIndonesian ? '🇮🇩 Indonesian' : '🌍 International'}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  {book.publication_date && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-midnight/50 font-semibold">Published</p>
                        <p className="text-sm font-bold text-midnight">
                          {new Date(book.publication_date).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}

                  {book.epub_isbn && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">🔖</span>
                      <div>
                        <p className="text-xs text-midnight/50 font-semibold">ISBN</p>
                        <p className="text-sm font-mono font-bold text-midnight">{book.epub_isbn}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🆔</span>
                    <div>
                      <p className="text-xs text-midnight/50 font-semibold">Book ID</p>
                      <p className="text-sm font-mono font-bold text-midnight">#{book.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Book Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              {/* Title */}
              <h1 className="text-4xl font-bold text-midnight mb-4 leading-tight">
                {book.title}
              </h1>

              {/* Authors */}
              {book.authors && book.authors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✍️</span>
                    <div>
                      <p className="text-sm text-midnight/50 font-semibold mb-1">Author(s)</p>
                      <p className="text-lg text-midnight font-medium">
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Publisher */}
              {book.publisher && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <p className="text-sm text-midnight/50 font-semibold mb-1">Publisher</p>
                      <p className="text-lg text-midnight font-medium">{book.publisher}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-midnight mb-4 flex items-center gap-2">
                    📝 Description
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-midnight/70 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Subjects/Categories */}
              {book.subjects && book.subjects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-midnight mb-4 flex items-center gap-2">
                    🏷️ Subjects & Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {book.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
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
      </main>
    </div>
  )
}
