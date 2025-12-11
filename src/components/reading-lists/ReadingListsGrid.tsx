'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiPlus, HiBookmark } from 'react-icons/hi2'
import CreateListModal from './CreateListModal'

interface ReadingList {
  id: string
  name: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  books: any[]
  _count: { books: number }
}

export default function ReadingListsGrid() {
  const router = useRouter()
  const [lists, setLists] = useState<ReadingList[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/lists')
      
      if (!response.ok) {
        console.error('Lists API error:', response.status, response.statusText)
        throw new Error(`Failed to fetch lists: ${response.statusText}`)
      }
      
      const data = await response.json()
      setLists(data)
    } catch (error) {
      console.error('Error fetching lists:', error)
      setLists([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchLists()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-200 rounded-3xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-midnight">Reading Lists</h1>
            <p className="text-midnight/60 mt-2">Organize your books into themed collections</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <HiPlus className="w-5 h-5" />
            Create List
          </motion.button>
        </div>

        {/* Lists Grid */}
        {lists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gradient-to-br from-accent/5 to-purple-600/5 rounded-3xl border-2 border-dashed border-accent/20"
          >
            <HiBookmark className="w-16 h-16 mx-auto text-accent/40 mb-4" />
            <h3 className="text-xl font-semibold text-midnight mb-2">No Reading Lists Yet</h3>
            <p className="text-midnight/60 mb-6">Create your first list to start organizing your books</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition"
            >
              Create Your First List
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list, idx) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => router.push(`/reading-lists/${list.id}`)}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-midnight group-hover:text-accent transition">
                        {list.name}
                      </h3>
                      {list.description && (
                        <p className="text-sm text-midnight/60 mt-1 line-clamp-2">
                          {list.description}
                        </p>
                      )}
                    </div>
                    {list.isPublic && (
                      <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Book Count */}
                  <div className="text-sm text-midnight/60">
                    {list._count.books} {list._count.books === 1 ? 'book' : 'books'}
                  </div>

                  {/* Book Covers Preview */}
                  {list.books.length > 0 && (
                    <div className="flex -space-x-2">
                      {list.books.slice(0, 4).map((listBook) => (
                        <div
                          key={listBook.id}
                          className="w-12 h-16 rounded-lg border-2 border-white shadow-md overflow-hidden bg-accent/10 flex items-center justify-center text-xs font-semibold text-midnight/40"
                        >
                          {listBook.book.cover_image_url ? (
                            <img
                              src={listBook.book.cover_image_url}
                              alt={listBook.book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            '📚'
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs text-midnight/40 pt-2 border-t border-midnight/10">
                    Updated {new Date(list.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}
