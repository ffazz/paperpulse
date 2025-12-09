'use client'

import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

interface BookFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function BookFilters({ onFilterChange }: BookFiltersProps) {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const handleApplyFilters = () => {
    onFilterChange({
      search,
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
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-lg text-gray-800">🔍 Filter & Pencarian</h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cari Judul atau Penulis
        </label>
        <Input
          type="text"
          placeholder="Masukkan judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white/50 px-4 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Semua Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Fiksi">Fiksi</option>
          <option value="Roman">Roman</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Thriller">Thriller</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
          <option value="Historical Fiction">Historical Fiction</option>
          <option value="Fiksi Sejarah">Fiksi Sejarah</option>
          <option value="Self-Help">Self-Help</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bahasa
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white/50 px-4 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Semua Bahasa</option>
          <option value="Indonesian">Indonesia</option>
          <option value="English">English</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urutkan Berdasarkan
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white/50 px-4 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="rating">Rating Tertinggi</option>
          <option value="year">Tahun Terbaru</option>
          <option value="pages">Jumlah Halaman</option>
          <option value="title">Judul (A-Z)</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="flex-1">
          Terapkan Filter
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  )
}