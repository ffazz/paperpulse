'use client'

import { useState } from 'react'
import BookList from '@/components/BookList'
import BookFilters from '@/components/BookFilters'
import { useBooks } from '@/hooks/useBooks'
import { FilterOptions } from '@/types'

export default function BooksPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const { books, loading } = useBooks(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          📚 Jelajahi Koleksi Buku
        </h1>
        <p className="text-gray-600">
          Temukan buku Indonesia dan Internasional populer 2020-2025
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <BookFilters onFilterChange={setFilters} />
        </div>

        {/* Books Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 text-sm text-gray-600">
            {!loading && `Menampilkan ${books.length} buku`}
          </div>
          <BookList books={books} loading={loading} />
        </div>
      </div>
    </div>
  )
}
