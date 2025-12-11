'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { useToast } from '@/hooks/useToast'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
  initialData: {
    name: string
    bio: string
    location: string
    website: string
    twitter: string
    instagram: string
    goodreads: string
    favoriteGenres: string[]
    showEmail: boolean
    showReadingGoal: boolean
    isPublic: boolean
  }
}

export function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
  const { success, error } = useToast()
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)
  const [genreInput, setGenreInput] = useState('')

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'reading', label: 'Reading Preferences' },
    { id: 'privacy', label: 'Privacy' },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addGenre = () => {
    if (genreInput.trim() && formData.favoriteGenres.length < 5) {
      setFormData(prev => ({
        ...prev,
        favoriteGenres: [...prev.favoriteGenres, genreInput.trim()]
      }))
      setGenreInput('')
    }
  }

  const removeGenre = (index: number) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${initialData.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save profile')
      
      success('Profile updated successfully')
      onClose()
      onSave?.()
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white z-10">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 px-6 pt-4 border-b overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      maxLength={50}
                      placeholder="Your name"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      maxLength={500}
                      placeholder="Tell others about yourself"
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        maxLength={100}
                        placeholder="City, Country"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links Tab */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goodreads
                    </label>
                    <input
                      type="text"
                      value={formData.goodreads}
                      onChange={(e) => handleInputChange('goodreads', e.target.value)}
                      placeholder="username or profile URL"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Reading Preferences Tab */}
              {activeTab === 'reading' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Genres ({formData.favoriteGenres.length}/5)
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addGenre()}
                        placeholder="Add a genre"
                        disabled={formData.favoriteGenres.length >= 5}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                      <button
                        onClick={addGenre}
                        disabled={formData.favoriteGenres.length >= 5 || !genreInput.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.favoriteGenres.map((genre, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {genre}
                          <button
                            onClick={() => removeGenre(index)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-gray-600">Allow others to view your profile</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showEmail}
                      onChange={(e) => handleInputChange('showEmail', e.target.checked)}
                      className="w-4 h-4"
                      disabled={!formData.isPublic}
                    />
                    <div>
                      <p className="font-medium">Show Email</p>
                      <p className="text-sm text-gray-600">Display your email on your profile</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showReadingGoal}
                      onChange={(e) => handleInputChange('showReadingGoal', e.target.checked)}
                      className="w-4 h-4"
                      disabled={!formData.isPublic}
                    />
                    <div>
                      <p className="font-medium">Show Reading Goal</p>
                      <p className="text-sm text-gray-600">Display your reading goal progress</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition font-medium"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
