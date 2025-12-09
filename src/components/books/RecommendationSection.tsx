'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiSparkles } from 'react-icons/hi2'
import { BookWithSimilarity } from '@/types'
import BookCard from './BookCard'

interface RecommendationSectionProps {
  bookId: string
}

export default function RecommendationSection({ bookId }: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<BookWithSimilarity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/recommend?bookId=${bookId}&limit=6`)
        const data = await response.json()
        setRecommendations(data)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [bookId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-midnight/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-midnight/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <HiSparkles className="w-8 h-8 text-accent" />
        <h2 className="text-4xl font-bold tracking-tight">
          You might also <span className="text-accent">enjoy</span>
        </h2>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book, idx) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative"
          >
            <BookCard book={book} />
            
            {/* Similarity Badge */}
            {book.similarityScore && book.similarityScore > 0.3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
                className="absolute -top-2 -right-2 z-10"
              >
                <div className="bg-gradient-to-r from-accent to-glow text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {Math.round(book.similarityScore * 100)}% match
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-midnight/60 bg-midnight/5 rounded-2xl p-6"
      >
        <p>
          💡 Recommendations based on <strong>genre similarity (30%)</strong>, <strong>vibes match (40%)</strong>, 
          <strong> themes overlap (20%)</strong>, and <strong>rating + page count (10%)</strong>
        </p>
      </motion.div>
    </div>
  )
}
