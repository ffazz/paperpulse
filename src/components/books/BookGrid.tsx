'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import BookCard from './BookCard'
import { useBookmarks } from '@/hooks/useBookmarks'
import { Book } from '@/types'

interface BookGridProps {
  books: Book[]
  loading: boolean
}

export default function BookGrid({ books, loading }: BookGridProps) {
  const { data: session } = useSession()
  const { favoriteIds, toggleBookmark } = useBookmarks()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-60 sm:h-72 md:h-80 rounded-xl md:rounded-2xl mb-3 md:mb-4"></div>
            <div className="bg-gray-200 h-3 md:h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-3 md:h-4 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold text-midnight mb-2">No books found</h3>
        <p className="text-sm md:text-base text-midnight/60">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          index={index}
          isFavorite={session ? favoriteIds.has(book.id) : false}
          onToggleFavorite={session ? toggleBookmark : undefined}
        />
      ))}
    </div>
  )
}
