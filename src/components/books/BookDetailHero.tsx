'use client'

import { motion } from 'framer-motion'
import { Book } from '@/types'

interface BookDetailHeroProps {
  book: Book
}

export default function BookDetailHero({ book }: BookDetailHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8 md:p-12 mb-12"
    >
      <div className="grid md:grid-cols-3 gap-12">
        {/* Book Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1"
        >
          <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 via-glow/10 to-transparent rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 to-transparent" />
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3 }}
              className="text-8xl relative z-10"
            >
              📖
            </motion.div>
          </div>
        </motion.div>

        {/* Book Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Title & Author */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight mb-3 leading-tight">
              {book.title}
            </h1>
            {book.authors && book.authors.length > 0 && (
              <p className="text-xl text-midnight/60">by {book.authors.join(', ')}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-midnight/10" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {book.publisher && (
              <div>
                <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Publisher</div>
                <div className="text-lg font-semibold text-midnight">{book.publisher}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Language</div>
              <div className="text-lg font-semibold text-midnight">
                {book.language === 'Indonesian' ? 'Indonesian' : 'English'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
