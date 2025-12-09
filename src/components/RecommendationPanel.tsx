'use client'

import { useEffect, useState } from 'react'
import { BookWithSimilarity } from '@/types'
import BookCard from './BookCard'

interface RecommendationPanelProps {
  bookId: string
}

export default function RecommendationPanel({ bookId }: RecommendationPanelProps) {
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
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ✨ Rekomendasi Serupa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-4 h-48 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ✨ Rekomendasi Serupa
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((book) => (
          <div key={book.id} className="relative">
            <BookCard book={book} />
            {book.similarityScore && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round(book.similarityScore * 100)}% match
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
