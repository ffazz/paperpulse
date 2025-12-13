'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { HiHeart } from 'react-icons/hi2'
import { Book } from '@/types'

interface BookCardProps {
  book: Book
  index: number
  isFavorite?: boolean
  onToggleFavorite?: (bookId: number) => void
}

export default function BookCard({ book, index, isFavorite = false, onToggleFavorite }: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Check if book.language exists (singular)
  const isIndonesian = book.language 
    ? (() => {
        const lang = book.language.toLowerCase()
        return lang.includes('indonesia') || 
               lang.includes('indonesian') || 
               lang === 'id' || 
               lang === 'ind'
      })()
    : false

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!onToggleFavorite || isAdding) return
    
    setIsAdding(true)
    await onToggleFavorite(book.id)
    setIsAdding(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/books/${book.id}`}
        className="group block bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-midnight/5 relative"
      >
        {/* Book Cover */}
        <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden">
          {!imageError && book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
              <div className="text-center p-4 md:p-6">
                <div className="text-4xl md:text-6xl mb-2">📚</div>
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

          {/* Favorite Button */}
          {onToggleFavorite && (
            <motion.button
              onClick={handleFavoriteClick}
              disabled={isAdding}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-2 md:top-4 left-2 md:left-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiHeart
                className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-midnight/40 hover:text-red-500'
                }`}
              />
            </motion.button>
          )}
        </div>

        {/* Book Info */}
        <div className="p-3 md:p-4 lg:p-6">
          <h3 className="font-bold text-base md:text-lg lg:text-xl mb-2 md:mb-3 line-clamp-2 text-midnight group-hover:text-accent transition-colors">
            {book.title}
          </h3>

          {book.authors && book.authors.length > 0 && (
            <p className="text-xs md:text-sm text-midnight/60 mb-1 md:mb-2 line-clamp-1">
              ✍️ {book.authors.join(', ')}
            </p>
          )}

          {book.publisher && (
            <p className="text-xs text-midnight/40 mb-2 md:mb-4 line-clamp-1">
              📚 {book.publisher}
            </p>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2">
              {book.subjects.slice(0, 2).map((subject, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 md:py-1 bg-accent/10 text-accent rounded text-xs font-medium"
                >
                  {subject}
                </span>
              ))}
              {book.subjects.length > 2 && (
                <span className="px-2 py-1 bg-midnight/5 text-midnight/60 rounded-md text-xs">
                  +{book.subjects.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
