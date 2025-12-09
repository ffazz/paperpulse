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
      const lang = book.language?.toLowerCase()
      return lang?.includes('indonesia') || lang?.includes('indonesian') || lang === 'id' || lang === 'ind'
    }).length

    const international = books.length - indonesian

    return {
      total: books.length,
      indonesian,
      international
    }
  }, [books])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Browse <span className="text-accent">Books</span>
          </h1>
          <p className="text-xl text-midnight/60">
            {loading ? 'Loading...' : `${books.length} books curated for you`}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {!loading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Indonesian Books */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🇮🇩</span>
                  <p className="text-sm font-semibold text-midnight/70">Indonesian Books</p>
                </div>
                <p className="text-4xl font-bold text-red-600">
                  {stats.indonesian.toLocaleString()}
                </p>
              </div>

              {/* International Books */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🌍</span>
                  <p className="text-sm font-semibold text-midnight/70">International Books</p>
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.international.toLocaleString()}
                </p>
              </div>

              {/* Total Books */}
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📚</span>
                  <p className="text-sm font-semibold text-midnight/70">Total Books</p>
                </div>
                <p className="text-4xl font-bold text-indigo-600">
                  {stats.total.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <BookFilters onFilterChange={setFilters} />
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
