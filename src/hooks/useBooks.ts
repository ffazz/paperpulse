'use client'

import { useState, useEffect } from 'react'
import { Book, FilterOptions } from '@/types'

export function useBooks(filters?: FilterOptions) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        if (filters?.search) params.append('search', filters.search)
        if (filters?.genre) params.append('genre', filters.genre)
        if (filters?.language) params.append('language', filters.language)
        if (filters?.minRating) params.append('minRating', filters.minRating.toString())
        if (filters?.maxRating) params.append('maxRating', filters.maxRating.toString())
        if (filters?.sortBy) params.append('sortBy', filters.sortBy)
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

        const response = await fetch(`/api/books?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }

        const data = await response.json()
        setBooks(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [filters?.search, filters?.genre, filters?.language, filters?.minRating, filters?.maxRating, filters?.sortBy, filters?.sortOrder])

  return { books, loading, error }
}