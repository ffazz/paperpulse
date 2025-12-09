'use client'

import { motion } from 'framer-motion'
import { Book } from '@/types'
import BookCard from './BookCard'

interface BookGridProps {
  books: Book[]
  loading?: boolean
}

export default function BookGrid({ books, loading }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-2xl bg-midnight/5 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold mb-2">No books found</h3>
        <p className="text-midnight/60">Try adjusting your filters</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {books.map((book, idx) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        >
          <BookCard book={book} />
        </motion.div>
      ))}
    </div>
  )
}
