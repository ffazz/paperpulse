import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface BookmarkData {
  id: string
  userId: string
  bookId: number
  createdAt: string
  book: {
    id: number
    title: string
    authors: string[]
    cover_image_url: string | null
    publisher: string
    subjects: string[]
    language: string
  }
}

export function useBookmarks() {
  const { data: session } = useSession()
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [loading, setLoading] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())

  // Fetch all bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!session?.user) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks')
      if (res.ok) {
        const data = await res.json()
        setBookmarks(data)
        setFavoriteIds(new Set(data.map((b: BookmarkData) => b.bookId)))
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user])

  // Add to bookmarks
  const addBookmark = useCallback(async (bookId: number) => {
    if (!session?.user) {
      alert('Please sign in to add favorites')
      return false
    }

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      })

      if (res.ok) {
        setFavoriteIds(prev => new Set([...prev, bookId]))
        // Re-fetch bookmarks
        const bookmarksRes = await fetch('/api/bookmarks')
        if (bookmarksRes.ok) {
          const data = await bookmarksRes.json()
          setBookmarks(data)
        }
        return true
      }
    } catch (error) {
      console.error('Error adding bookmark:', error)
    }
    return false
  }, [session?.user])

  // Remove from bookmarks
  const removeBookmark = useCallback(async (bookId: number) => {
    try {
      const res = await fetch(`/api/bookmarks?bookId=${bookId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(bookId)
          return newSet
        })
        setBookmarks(prev => prev.filter(b => b.bookId !== bookId))
        return true
      }
    } catch (error) {
      console.error('Error removing bookmark:', error)
    }
    return false
  }, [])

  // Toggle bookmark
  const toggleBookmark = useCallback(async (bookId: number) => {
    if (favoriteIds.has(bookId)) {
      return removeBookmark(bookId)
    } else {
      return addBookmark(bookId)
    }
  }, [favoriteIds, addBookmark, removeBookmark])

  // Fetch bookmarks on mount and when session changes
  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  return {
    bookmarks,
    loading,
    favoriteIds,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    refetch: fetchBookmarks,
  }
}
