'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BookGrid from '@/components/books/BookGrid'
import BookFilters from '@/components/books/BookFilters'
import { useBooks } from '@/hooks/useBooks'
import { FilterOptions } from '@/types'

export default function BooksPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const { books, loading } = useBooks(filters)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Browse <span className="text-accent">Books</span>
          </h1>
          <p className="text-xl text-midnight/60">
            {loading ? 'Loading...' : `${books.length} books curated for you`}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <BookFilters onFilterChange={setFilters} />
          </motion.div>

          {/* Books Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <BookGrid books={books} loading={loading} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
