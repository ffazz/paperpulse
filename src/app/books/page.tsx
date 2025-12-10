'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import BookGrid from '@/components/books/BookGrid'
import BookFilters from '@/components/books/BookFilters'
import { useBooks } from '@/hooks/useBooks'
import { FilterOptions } from '@/types'

export default function BooksPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const { books, loading } = useBooks(filters)

  // Calculate stats
  const stats = useMemo(() => {
    const indonesian = books.filter(book => {
      if (!book.language) return false
      const lang = book.language.toLowerCase()
      return lang.includes('indonesia') || lang.includes('indonesian') || lang === 'id' || lang === 'ind'
    }).length

    const international = books.length - indonesian

    return {
      total: books.length,
      indonesian,
      international
    }
  }, [books])

  // Get unique subjects and publishers for filters
  const availableSubjects = useMemo(() => {
    const subjectsSet = new Set<string>()
    books.forEach(book => {
      if (book.subjects && Array.isArray(book.subjects)) {
        book.subjects.forEach(subject => subjectsSet.add(subject))
      }
    })
    return Array.from(subjectsSet).sort()
  }, [books])

  const availablePublishers = useMemo(() => {
    const publishersSet = new Set<string>()
    books.forEach(book => {
      if (book.publisher) {
        publishersSet.add(book.publisher)
      }
    })
    return Array.from(publishersSet).sort()
  }, [books])

  return (
    <div className="min-h-screen pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-2 md:mb-3 lg:mb-4">
            Browse <span className="text-accent">Books</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-midnight/60">
            {loading ? 'Loading...' : `${books.length} books curated for you`}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {!loading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 md:mb-10 lg:mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-4">
              {/* Indonesian Books */}
              <div className="bg-red-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <span className="text-2xl md:text-3xl">🇮🇩</span>
                  <p className="text-xs md:text-sm font-semibold text-midnight/70">Indonesian Books</p>
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600">
                  {stats.indonesian.toLocaleString()}
                </p>
              </div>

              {/* International Books */}
              <div className="bg-blue-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <span className="text-2xl md:text-3xl">🌍</span>
                  <p className="text-xs md:text-sm font-semibold text-midnight/70">International Books</p>
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
                  {stats.international.toLocaleString()}
                </p>
              </div>

              {/* Total Books */}
              <div className="bg-indigo-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <span className="text-2xl md:text-3xl">📚</span>
                  <p className="text-xs md:text-sm font-semibold text-midnight/70">Total Books</p>
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                  {stats.total.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <BookFilters 
              onFilterChange={setFilters}
              availableSubjects={availableSubjects}
              availablePublishers={availablePublishers}
            />
          </motion.div>

          {/* Books Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <BookGrid books={books} loading={loading} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
