import { useState, useEffect } from 'react'
import { FilterOptions, Book } from '@/types'

export function useBooks(filters: FilterOptions) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        
        if (filters.language) params.append('language', filters.language)
        if (filters.subject) params.append('subject', filters.subject)
        if (filters.publisher) params.append('publisher', filters.publisher)
        if (filters.search) params.append('search', filters.search)
        if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString())
        if (filters.yearTo) params.append('yearTo', filters.yearTo.toString())

        const response = await fetch(`/api/books?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('❌ Failed to fetch books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [filters])

  return { books, loading }
}
