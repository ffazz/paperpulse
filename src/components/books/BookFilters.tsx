'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface BookFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function BookFilters({ onFilterChange }: BookFiltersProps) {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const genres = [
    'Fiction', 'Fiksi', 'Roman', 'Fantasy', 'Thriller', 
    'Mystery', 'Romance', 'Historical Fiction', 'Fiksi Sejarah', 
    'Self-Help', 'Horror'
  ]

  const handleApplyFilters = () => {
    onFilterChange({
      search: search || undefined,
      genre: genre || undefined,
      language: language || undefined,
      sortBy,
      sortOrder: 'desc',
    })
  }

  const handleReset = () => {
    setSearch('')
    setGenre('')
    setLanguage('')
    setSortBy('rating')
    onFilterChange({})
  }

  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiAdjustmentsHorizontal className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg">Filters</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-midnight/40 hover:text-midnight transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/60">Search</label>
          <Input
            type="text"
            placeholder="Title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/60">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-midnight/10 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/60">Language</label>
          <div className="grid grid-cols-2 gap-2">
            {['', 'Indonesian', 'English'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  px-4 py-2 rounded-xl font-medium text-sm transition-all
                  ${language === lang
                    ? 'bg-midnight text-ghost'
                    : 'bg-midnight/5 hover:bg-midnight/10'
                  }
                `}
              >
                {lang || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/60">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-midnight/10 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          >
            <option value="rating">Highest Rated</option>
            <option value="year">Newest</option>
            <option value="pages">Page Count</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Apply Button */}
        <Button
          onClick={handleApplyFilters}
          className="w-full"
        >
          Apply Filters
        </Button>
      </motion.div>
    </div>
  )
}
