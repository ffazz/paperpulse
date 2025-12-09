'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FilterOptions } from '@/types'

interface BookFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  availableSubjects: string[]
  availablePublishers: string[]
}

export default function BookFilters({ 
  onFilterChange, 
  availableSubjects,
  availablePublishers 
}: BookFiltersProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedPublisher, setSelectedPublisher] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [yearFrom, setYearFrom] = useState<string>('')
  const [yearTo, setYearTo] = useState<string>('')

  const handleFilterChange = () => {
    onFilterChange({
      language: selectedLanguage || undefined,
      subject: selectedSubject || undefined,
      publisher: selectedPublisher || undefined,
      search: searchQuery || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
    })
  }

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    onFilterChange({
      language: lang || undefined,
      subject: selectedSubject || undefined,
      publisher: selectedPublisher || undefined,
      search: searchQuery || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
    })
  }

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject)
    handleFilterChange()
  }

  const handlePublisherChange = (publisher: string) => {
    setSelectedPublisher(publisher)
    handleFilterChange()
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    handleFilterChange()
  }

  const handleYearChange = () => {
    handleFilterChange()
  }

  const clearFilters = () => {
    setSelectedLanguage('')
    setSelectedSubject('')
    setSelectedPublisher('')
    setSearchQuery('')
    setYearFrom('')
    setYearTo('')
    onFilterChange({})
  }

  const hasActiveFilters = selectedLanguage || selectedSubject || selectedPublisher || searchQuery || yearFrom || yearTo

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 sticky top-24"
    >
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-midnight">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-accent hover:underline font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-sm font-semibold text-midnight/70 mb-3">
          🔍 Search Books
        </label>
        <input
          type="text"
          placeholder="Search by title, author, publisher..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-midnight/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-midnight/40"
        />
      </div>

      {/* Language Filter */}
      <div>
        <label className="block text-sm font-semibold text-midnight/70 mb-3">
          🌐 Language
        </label>
        <div className="space-y-2">
          <button
            onClick={() => handleLanguageChange('')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              selectedLanguage === '' 
                ? 'border-accent bg-accent/5 text-accent font-semibold shadow-sm' 
                : 'border-midnight/10 hover:border-accent/50 hover:bg-accent/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🌍</span>
              <span>All Languages</span>
            </div>
          </button>

          <button
            onClick={() => handleLanguageChange('Indonesian')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              selectedLanguage === 'Indonesian' 
                ? 'border-red-500 bg-red-50 text-red-700 font-semibold shadow-sm' 
                : 'border-midnight/10 hover:border-red-300 hover:bg-red-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇮🇩</span>
              <span>Indonesian</span>
            </div>
          </button>

          <button
            onClick={() => handleLanguageChange('English')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              selectedLanguage === 'English' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                : 'border-midnight/10 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇬🇧</span>
              <span>English</span>
            </div>
          </button>
        </div>
      </div>

      {/* Subject/Genre Filter */}
      <div>
        <label className="block text-sm font-semibold text-midnight/70 mb-3">
          📚 Subject / Genre
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-midnight/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all cursor-pointer bg-white"
        >
          <option value="">All Subjects</option>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Publisher Filter */}
      <div>
        <label className="block text-sm font-semibold text-midnight/70 mb-3">
          🏢 Publisher
        </label>
        <select
          value={selectedPublisher}
          onChange={(e) => handlePublisherChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-midnight/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all cursor-pointer bg-white"
        >
          <option value="">All Publishers</option>
          {availablePublishers.slice(0, 30).map((publisher) => (
            <option key={publisher} value={publisher}>
              {publisher}
            </option>
          ))}
        </select>
      </div>

      {/* Publication Year Filter */}
      <div>
        <label className="block text-sm font-semibold text-midnight/70 mb-3">
          📅 Publication Year
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="From (e.g., 2000)"
            value={yearFrom}
            onChange={(e) => {
              setYearFrom(e.target.value)
              handleYearChange()
            }}
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 rounded-lg border border-midnight/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
          <input
            type="number"
            placeholder="To (e.g., 2024)"
            value={yearTo}
            onChange={(e) => {
              setYearTo(e.target.value)
              handleYearChange()
            }}
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 rounded-lg border border-midnight/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-midnight/10"
        >
          <p className="text-sm text-midnight/60 mb-3 font-medium">Active Filters:</p>
          <div className="space-y-2">
            {selectedLanguage && (
              <div className="flex items-center justify-between px-3 py-2 bg-accent/5 rounded-lg">
                <span className="text-sm text-midnight/80">
                  Language: <span className="font-semibold">{selectedLanguage}</span>
                </span>
                <button
                  onClick={() => handleLanguageChange('')}
                  className="text-accent hover:text-accent/80 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedSubject && (
              <div className="flex items-center justify-between px-3 py-2 bg-accent/5 rounded-lg">
                <span className="text-sm text-midnight/80">
                  Subject: <span className="font-semibold">{selectedSubject}</span>
                </span>
                <button
                  onClick={() => handleSubjectChange('')}
                  className="text-accent hover:text-accent/80 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedPublisher && (
              <div className="flex items-center justify-between px-3 py-2 bg-accent/5 rounded-lg">
                <span className="text-sm text-midnight/80">
                  Publisher: <span className="font-semibold">{selectedPublisher.substring(0, 20)}</span>
                </span>
                <button
                  onClick={() => handlePublisherChange('')}
                  className="text-accent hover:text-accent/80 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            {(yearFrom || yearTo) && (
              <div className="flex items-center justify-between px-3 py-2 bg-accent/5 rounded-lg">
                <span className="text-sm text-midnight/80">
                  Year: <span className="font-semibold">{yearFrom || '...'} - {yearTo || '...'}</span>
                </span>
                <button
                  onClick={() => {
                    setYearFrom('')
                    setYearTo('')
                    handleYearChange()
                  }}
                  className="text-accent hover:text-accent/80 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
            {searchQuery && (
              <div className="flex items-center justify-between px-3 py-2 bg-accent/5 rounded-lg">
                <span className="text-sm text-midnight/80">
                  Search: <span className="font-semibold">"{searchQuery.substring(0, 20)}"</span>
                </span>
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-accent hover:text-accent/80 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-3 bg-midnight text-white rounded-lg hover:bg-midnight/90 transition-all font-semibold shadow-md hover:shadow-lg"
        >
          Clear All Filters
        </button>
      )}
    </motion.div>
  )
}
