'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiHeart, HiArrowLeft } from 'react-icons/hi2'
import { useBookmarks } from '@/hooks/useBookmarks'

export default function FavoritesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { bookmarks, loading, removeBookmark } = useBookmarks()
  const [isRemoving, setIsRemoving] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleRemoveFavorite = async (bookId: number) => {
    setIsRemoving(bookId)
    await removeBookmark(bookId)
    setIsRemoving(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ghost/30 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghost/30 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Go back</span>
          </button>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-red-500/20 rounded-xl md:rounded-2xl">
              <HiHeart className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight">
                My Favorites
              </h1>
              <p className="text-sm md:text-base text-midnight/60 mt-1">
                {bookmarks.length} book{bookmarks.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 md:py-24"
          >
            <div className="text-6xl md:text-7xl mb-4 md:mb-6">💔</div>
            <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-2">
              No favorites yet
            </h2>
            <p className="text-sm md:text-base text-midnight/60 text-center max-w-md mb-8">
              Start adding books to your favorites by clicking the heart icon on any book in the
              browse section.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 bg-accent text-white rounded-lg md:rounded-xl font-semibold hover:bg-accent/90 transition-colors"
            >
              Browse Books
            </Link>
          </motion.div>
        ) : (
          /* Favorites Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {bookmarks.map((bookmark, index) => {
              const { book } = bookmark
              const isIndonesian = book.language
                ? (() => {
                    const lang = book.language.toLowerCase()
                    return (
                      lang.includes('indonesia') ||
                      lang.includes('indonesian') ||
                      lang === 'id' ||
                      lang === 'ind'
                    )
                  })()
                : false

              return (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-midnight/5"
                >
                  <Link href={`/books/${book.id}`} className="block">
                    {/* Book Cover */}
                    <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden">
                      {book.cover_image_url ? (
                        <Image
                          src={book.cover_image_url}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
                          <div className="text-center p-4 md:p-6">
                            <div className="text-4xl md:text-5xl mb-2">📚</div>
                            <p className="text-xs md:text-sm text-midnight/40 font-medium line-clamp-2">
                              {book.title}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Language Badge */}
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10">
                        <span
                          className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                            isIndonesian
                              ? 'bg-red-500/90 text-white'
                              : 'bg-blue-500/90 text-white'
                          }`}
                        >
                          {isIndonesian ? '🇮🇩 ID' : '🌍 INT'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Book Info & Remove Button */}
                  <div className="p-3 md:p-4 lg:p-5">
                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-bold text-base md:text-lg line-clamp-2 text-midnight group-hover:text-accent transition-colors mb-2">
                        {book.title}
                      </h3>
                    </Link>

                    {book.authors && book.authors.length > 0 && (
                      <p className="text-xs md:text-sm text-midnight/60 mb-1 md:mb-2 line-clamp-1">
                        ✍️ {book.authors.join(', ')}
                      </p>
                    )}

                    {book.publisher && (
                      <p className="text-xs text-midnight/40 mb-3 md:mb-4 line-clamp-1">
                        📚 {book.publisher}
                      </p>
                    )}

                    <motion.button
                      onClick={() => handleRemoveFavorite(book.id)}
                      disabled={isRemoving === book.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-red-500/10 text-red-500 rounded-lg md:rounded-lg font-medium text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiHeart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                      {isRemoving === book.id ? 'Removing...' : 'Remove'}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
