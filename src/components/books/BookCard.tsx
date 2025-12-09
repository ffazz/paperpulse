'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Book } from '@/types'

interface BookCardProps {
  book: Book
  index: number
}

export default function BookCard({ book, index }: BookCardProps) {
  const [imageError, setImageError] = useState(false)

  // ✅ FIX: Check if book.language exists (singular)
  const isIndonesian = book.language 
    ? (() => {
        const lang = book.language.toLowerCase()
        return lang.includes('indonesia') || 
               lang.includes('indonesian') || 
               lang === 'id' || 
               lang === 'ind'
      })()
    : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/books/${book.id}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-midnight/5"
      >
        {/* Book Cover */}
        <div className="relative h-80 bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden">
          {!imageError && book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
              <div className="text-center p-6">
                <div className="text-6xl mb-2">📚</div>
                <p className="text-sm text-midnight/40 font-medium line-clamp-2">
                  {book.title}
                </p>
              </div>
            </div>
          )}

          {/* Language Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                isIndonesian
                  ? 'bg-red-500/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}
            >
              {isIndonesian ? '🇮🇩 ID' : '🌍 INT'}
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 line-clamp-2 text-midnight group-hover:text-accent transition-colors">
            {book.title}
          </h3>

          {book.authors && book.authors.length > 0 && (
            <p className="text-sm text-midnight/60 mb-2 line-clamp-1">
              ✍️ {book.authors.join(', ')}
            </p>
          )}

          {book.publisher && (
            <p className="text-xs text-midnight/40 mb-4">
              📚 {book.publisher}
            </p>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.subjects.slice(0, 2).map((subject, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium"
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
