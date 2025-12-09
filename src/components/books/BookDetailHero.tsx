'use client'

import { motion } from 'framer-motion'
import { HiStar, HiBookOpen, HiCalendar } from 'react-icons/hi2'
import { Book } from '@/types'
import { Badge } from '@/components/ui/Badge'

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

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-midnight/5 rounded-xl p-3 text-center">
              <HiStar className="w-6 h-6 text-accent mx-auto mb-1" />
              <div className="text-lg font-bold">{book.rating.toFixed(1)}</div>
              <div className="text-xs text-midnight/60">Rating</div>
            </div>
            <div className="bg-midnight/5 rounded-xl p-3 text-center">
              <HiBookOpen className="w-6 h-6 text-accent mx-auto mb-1" />
              <div className="text-lg font-bold">{book.pages}</div>
              <div className="text-xs text-midnight/60">Pages</div>
            </div>
            <div className="bg-midnight/5 rounded-xl p-3 text-center">
              <HiCalendar className="w-6 h-6 text-accent mx-auto mb-1" />
              <div className="text-lg font-bold">{book.year}</div>
              <div className="text-xs text-midnight/60">Year</div>
            </div>
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
            <p className="text-xl text-midnight/60">by {book.author}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10">
              <HiStar className="w-5 h-5 text-accent" />
              <span className="font-bold text-accent">{book.rating.toFixed(1)}</span>
            </div>
            <Badge variant="secondary">{book.genre}</Badge>
            <Badge variant="outline">
              {book.language === 'Indonesian' ? '🇮🇩 Indonesia' : '🌍 English'}
            </Badge>
          </div>

          {/* Divider */}
          <div className="border-t border-midnight/10" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Genre</div>
              <div className="text-lg font-semibold text-midnight">{book.genre}</div>
            </div>
            <div>
              <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Language</div>
              <div className="text-lg font-semibold text-midnight">
                {book.language === 'Indonesian' ? 'Indonesian' : 'English'}
              </div>
            </div>
            <div>
              <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Pages</div>
              <div className="text-lg font-semibold text-midnight">{book.pages} pages</div>
            </div>
            <div>
              <div className="text-sm text-midnight/60 mb-1 uppercase tracking-wide font-medium">Published</div>
              <div className="text-lg font-semibold text-midnight">{book.year}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-midnight/10" />

          {/* Vibes */}
          <div>
            <h3 className="text-lg font-bold text-midnight mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-accent to-glow rounded-full" />
              Vibes
            </h3>
            <div className="flex flex-wrap gap-2">
              {book.vibes.map((vibe, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 font-medium hover:shadow-lg transition-shadow"
                >
                  {vibe}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div>
            <h3 className="text-lg font-bold text-midnight mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {book.themes.map((theme, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium hover:shadow-lg transition-shadow"
                >
                  {theme}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
