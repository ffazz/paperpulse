'use client'

import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight, HiUser } from 'react-icons/hi2'

interface Book {
  id: number
  title: string
  authors: string[]
  cover_image_url?: string
}

interface ListBook {
  id: string
  bookId: number
  note?: string
  favoriteQuote?: string
  book: Book
}

interface PublicList {
  id: string
  name: string
  description?: string
  shareSlug: string
  createdAt: string
  user: {
    name?: string
  }
  books: ListBook[]
  _count: { books: number }
}

export default function PublicListView({ 
  params 
}: { 
  params: Promise<{ shareSlug: string }> 
}) {
  const [list, setList] = useState<PublicList | null>(null)
  const [loading, setLoading] = useState(true)
  const { shareSlug } = use(params)

  useEffect(() => {
    fetchList()
  }, [shareSlug])

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/public/lists/${shareSlug}`)
      if (!res.ok) throw new Error('List not found')
      const data = await res.json()
      setList(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold mb-2">List Not Found</h1>
          <p className="text-gray-600 mb-6">
            This reading list may have been deleted or made private.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
          >
            Back to Home
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <HiUser className="w-4 h-4" />
            <span>
              {list.user.name ? `${list.user.name}'s List` : 'Shared Reading List'}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-2">{list.name}</h1>
          {list.description && (
            <p className="text-gray-600 max-w-2xl">{list.description}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>{list._count.books} books</span>
            <span>•</span>
            <span>
              Shared on{' '}
              {new Date(list.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </motion.div>

        {/* Sign Up CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-8 border border-accent/20"
        >
          <h2 className="text-xl font-bold mb-2">Create Your Own Reading Lists</h2>
          <p className="text-gray-600 mb-4">
            Sign up to start organizing your books, tracking your reading goals, and
            sharing your lists with others.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium"
          >
            Get Started
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Books Grid */}
        {list.books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gray-50 rounded-3xl"
          >
            <p className="text-gray-500 text-lg">No books in this list yet</p>
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

                  <Link
                    href={`/books/${item.bookId}`}
                    className="block text-center text-sm py-2 text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
