'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiMagnifyingGlass, HiArrowLeft } from 'react-icons/hi2'
import { useRouter, useSearchParams } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string
  category: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  likeCount: number
  commentCount: number
  viewCount: number
  createdAt: string
}

export default function CircleDiscoverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState<'trending' | 'search'>(
    searchParams.has('q') ? 'search' : 'trending'
  )
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    if (activeTab === 'trending') {
      fetchTrending()
    } else if (searchQuery.trim()) {
      fetchSearch()
    }
  }, [activeTab, timeRange, searchQuery])

  const fetchTrending = async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/circle/posts/trending?timeRange=${timeRange}&limit=20`
      )
      const data = await res.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching trending:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '20',
        page: '1'
      })
      const res = await fetch(`/api/circle/posts/search?${params}`)
      const data = await res.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveTab('search')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container pt-24 pb-12"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Discover Circle</h1>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, discussions, reviews..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
          />
        </div>
      </form>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'trending'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔥 Trending
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔍 Search
        </button>
      </div>

      {/* Time Range Filter (for Trending) */}
      {activeTab === 'trending' && (
        <div className="flex gap-3 mb-8">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-accent text-white'
                  : 'border border-gray-200 text-gray-700 hover:border-accent'
              }`}
            >
              {range === '7d' ? 'This Week' : range === '30d' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {activeTab === 'trending'
              ? 'No trending posts at the moment'
              : 'No posts found. Try a different search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/circle/posts/${post.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent ml-4 shrink-0">
                  {post.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <Link
                  href={`/circle/users/${post.author.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 hover:text-accent"
                >
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/10">👤</div>
                  )}
                  <span className="font-medium">
                    {post.author.name || 'Anonymous'}
                  </span>
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-red-500">
                  <span>❤️</span>
                  <span className="text-sm">{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                  <span>💬</span>
                  <span className="text-sm">{post.commentCount}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span>👁️</span>
                  <span className="text-sm">{post.viewCount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
