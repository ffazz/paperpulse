'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSparkles, HiCheckCircle } from 'react-icons/hi2'
import BookCard from './BookCard'
import { Book } from '@/types'

interface RecommendationScore {
  book: Book
  score: number
  matchDetails: {
    authorScore: number
    subjectScore: number
    languageScore: number
    publisherScore: number
    yearScore: number
    popularityScore: number
  }
}

interface RecommendationSectionProps {
  bookId: number
}

export default function RecommendationSection({ bookId }: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/books/${bookId}/recommendations`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to load recommendations')
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchRecommendations()
    }
  }, [bookId])

  const visibleRecommendations = useMemo(() => {
    return recommendations.slice(0, 8)
  }, [recommendations])

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-white via-accent/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-8 w-72 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl animate-pulse" />
              <div className="h-4 w-96 bg-accent/5 rounded-lg animate-pulse" />
            </div>

            {/* Books grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="aspect-[2/3] bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl animate-pulse" />
                  <div className="h-4 bg-accent/5 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-accent/5 rounded animate-pulse" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || visibleRecommendations.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-accent/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <HiSparkles className="w-6 h-6 text-accent" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-accent via-purple-600 to-accent bg-clip-text text-transparent">
                  You Might Also Like
                </span>
              </h2>
            </div>
            <p className="text-midnight/60 md:text-lg">
              Curated recommendations based on advanced similarity matching
            </p>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {visibleRecommendations.map((rec, idx) => (
                <RecommendationCard
                  key={rec.book.id}
                  rec={rec}
                  idx={idx}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Info Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 md:grid-cols-4 gap-4 bg-gradient-to-r from-accent/5 to-purple-600/5 rounded-2xl p-6 border border-accent/10"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">35%</div>
              <div className="text-xs text-midnight/60 mt-1">Author Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">35%</div>
              <div className="text-xs text-midnight/60 mt-1">Genre Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15%</div>
              <div className="text-xs text-midnight/60 mt-1">Other Factors</div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-2xl font-bold text-blue-600">15%</div>
              <div className="text-xs text-midnight/60 mt-1">Popularity</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

interface RecommendationCardProps {
  rec: any
  idx: number
}

function RecommendationCard({ rec, idx }: RecommendationCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/books/${rec.book.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: idx * 0.08 }}
      onClick={handleCardClick}
      className="group relative h-full cursor-pointer"
    >
      {/* Score Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.3 + idx * 0.08,
          type: 'spring',
          stiffness: 200,
        }}
        className="absolute -top-2 -right-2 z-20 pointer-events-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className="relative bg-white px-3 py-1.5 rounded-full shadow-lg">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-transparent bg-gradient-to-r from-accent to-purple-600 bg-clip-text">
                {rec.score}%
              </span>
              <HiCheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Book Card Wrapper */}
      <div className="relative h-full bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-midnight/5">
        {/* Book Card Content */}
        <div className="relative h-full">
          <BookCard book={rec.book} index={idx} />

          {/* Match Details Hover Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl md:rounded-2xl p-4 flex flex-col justify-end pointer-events-none group-hover:pointer-events-auto transition-all"
          >
            <div className="space-y-2 text-xs text-white">
              {rec.matchDetails.authorScore > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-white/20 rounded h-1.5 flex-1">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded"
                      style={{
                        width: `${Math.min(rec.matchDetails.authorScore, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold">
                    Author
                  </span>
                </div>
              )}
              {rec.matchDetails.subjectScore > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-white/20 rounded h-1.5 flex-1">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded"
                      style={{
                        width: `${Math.min(rec.matchDetails.subjectScore, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold">
                    Genre
                  </span>
                </div>
              )}
              {rec.matchDetails.languageScore > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-white/20 rounded h-1.5 flex-1">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded"
                      style={{
                        width: `${Math.min(rec.matchDetails.languageScore, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold">
                    Lang
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
