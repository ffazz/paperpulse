'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  HiArrowLeft,
  HiPencil,
  HiTrash,
  HiShare,
  HiGlobeAlt,
  HiLockClosed,
  HiPlus,
  HiXMark,
} from 'react-icons/hi2'
import { useToast } from '@/hooks/useToast'
import AddBookModal from '@/components/reading-lists/AddBookModal'
import BookNoteEditor from '@/components/reading-lists/BookNoteEditor'

interface ListBook {
  id: string
  bookId: number
  note?: string
  favoriteQuote?: string
  book: {
    id: number
    title: string
    authors: string[]
    cover_image_url?: string
  }
}

interface ReadingList {
  id: string
  name: string
  description?: string
  isPublic: boolean
  shareSlug?: string
  books: ListBook[]
  _count: { books: number }
}

export default function ListDetailPage({ 
  params 
}: { 
  params: Promise<{ listId: string }> 
}) {
  const router = useRouter()
  const { addToast } = useToast()
  const { listId } = use(params)

  const [list, setList] = useState<ReadingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ name: '', description: '', isPublic: false })
  const [deleting, setDeleting] = useState(false)
  const [addBookOpen, setAddBookOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<{ id: number; title: string } | null>(null)

  useEffect(() => {
    fetchList()
  }, [listId])

  const fetchList = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/user/lists/${listId}`)
      if (!res.ok) throw new Error('Failed to fetch list')
      const data = await res.json()
      setList(data)
      setEditData({
        name: data.name,
        description: data.description || '',
        isPublic: data.isPublic,
      })
    } catch (error) {
      console.error('Error:', error)
      addToast('Failed to load list', 'error')
      router.push('/reading-lists')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateList = async () => {
    try {
      const res = await fetch(`/api/user/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (!res.ok) throw new Error('Failed to update')

      const updated = await res.json()
      setList(updated)
      setEditMode(false)
      addToast('List updated!', 'success')
    } catch (error) {
      console.error('Error:', error)
      addToast('Failed to update list', 'error')
    }
  }

  const handleDeleteList = async () => {
    if (!confirm('Are you sure you want to delete this list?')) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/user/lists/${listId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      addToast('List deleted!', 'success')
      router.push('/reading-lists')
    } catch (error) {
      console.error('Error:', error)
      addToast('Failed to delete list', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleRemoveBook = async (bookId: number) => {
    try {
      const res = await fetch(`/api/user/lists/${listId}/books?bookId=${bookId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to remove book')

      setList((prev) =>
        prev
          ? {
              ...prev,
              books: prev.books.filter((b) => b.bookId !== bookId),
              _count: { books: prev._count.books - 1 },
            }
          : null
      )

      addToast('Book removed from list', 'success')
    } catch (error) {
      console.error('Error:', error)
      addToast('Failed to remove book', 'error')
    }
  }

  const handleCopyShareLink = async () => {
    if (!list?.shareSlug) {
      addToast('List is not public', 'error')
      return
    }

    const url = `${window.location.origin}/shared/${list.shareSlug}`
    await navigator.clipboard.writeText(url)
    addToast('Share link copied!', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-16">
          <h1 className="text-2xl font-bold">List Not Found</h1>
          <button
            onClick={() => router.push('/reading-lists')}
            className="mt-4 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90"
          >
            Back to Lists
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/reading-lists')}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Lists
          </button>

          {editMode ? (
            <div className="space-y-4 bg-white rounded-3xl p-8">
              <div>
                <label className="block text-sm font-semibold mb-2">List Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value.slice(0, 100) })
                  }
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-accent outline-none"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value.slice(0, 500),
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-accent outline-none resize-none"
                  maxLength={500}
                />
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editData.isPublic}
                  onChange={(e) =>
                    setEditData({ ...editData, isPublic: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Make this list public</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 px-4 py-3 rounded-xl border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateList}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{list.name}</h1>
                {list.description && <p className="text-gray-600">{list.description}</p>}
                <div className="flex items-center gap-4 mt-4">
                  {list.isPublic ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <HiGlobeAlt className="w-5 h-5" />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-gray-400">
                      <HiLockClosed className="w-5 h-5" />
                      Private
                    </span>
                  )}
                  <span className="text-gray-600">
                    {list._count.books} {list._count.books === 1 ? 'book' : 'books'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {list.isPublic && (
                  <button
                    onClick={handleCopyShareLink}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    title="Copy share link"
                  >
                    <HiShare className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setEditMode(true)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteList}
                  disabled={deleting}
                  className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors disabled:opacity-50"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {list.books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gradient-to-br from-accent/5 to-accent/10 rounded-3xl"
          >
            <p className="text-gray-500 text-lg mb-4">No books in this list yet</p>
            <button
              onClick={() => setAddBookOpen(true)}
              className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90"
            >
              <HiPlus className="w-5 h-5 inline mr-2" />
              Add Book
            </button>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.books.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Book Cover */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {item.book.cover_image_url ? (
                    <Image
                      src={item.book.cover_image_url}
                      alt={item.book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📚
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold line-clamp-2 group-hover:text-accent transition-colors">
                      {item.book.title}
                    </h3>
                    {item.book.authors.length > 0 && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {item.book.authors.join(', ')}
                      </p>
                    )}
                  </div>

                  {item.note && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                      {item.note}
                    </div>
                  )}

                  {item.favoriteQuote && (
                    <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded line-clamp-2 italic">
                      "{item.favoriteQuote}"
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        setEditingBook({
                          id: item.bookId,
                          title: item.book.title,
                        })
                      }
                      className="flex-1 px-2 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <HiPencil className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleRemoveBook(item.bookId)}
                      className="flex-1 px-2 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                    >
                      <HiXMark className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={addBookOpen}
          onClose={() => setAddBookOpen(false)}
          listId={listId}
          onBookAdded={fetchList}
        />

        {/* Edit Notes Modal */}
        {editingBook && (
          <BookNoteEditor
            isOpen={!!editingBook}
            onClose={() => setEditingBook(null)}
            listId={listId}
            bookId={editingBook.id}
            bookTitle={editingBook.title}
            initialNote={
              list?.books.find((b) => b.bookId === editingBook.id)?.note
            }
            initialQuote={
              list?.books.find((b) => b.bookId === editingBook.id)
                ?.favoriteQuote
            }
            onSaved={fetchList}
          />
        )}
      </div>
    </div>
  )
}
