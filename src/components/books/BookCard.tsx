'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiStar } from 'react-icons/hi2'
import { Book } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <motion.div
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="group relative h-full rounded-2xl border border-midnight/5 hover:border-midnight/10 overflow-hidden bg-white/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300"
      >
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gradient-to-br from-accent/10 via-glow/5 to-transparent flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            className="text-6xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            📖
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Rating Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10">
              <HiStar className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold">{book.rating.toFixed(1)}</span>
            </div>
            <Badge variant="default">
              {book.language === 'Indonesian' ? '🇮🇩' : '🌍'}
            </Badge>
          </div>

          {/* Title & Author */}
          <div>
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-accent transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-midnight/60 mt-1">{book.author}</p>
          </div>

          {/* Genre Badge */}
          <Badge variant="secondary">{book.genre}</Badge>

          {/* Vibes */}
          <div className="flex flex-wrap gap-1">
            {book.vibes.slice(0, 2).map((vibe, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-midnight/5 text-midnight/60"
              >
                {vibe}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-midnight/40 pt-2 border-t border-midnight/5">
            <span>{book.pages} pages</span>
            <span>·</span>
            <span>{book.year}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
