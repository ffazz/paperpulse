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
    cover_image_url?: string | null
    publisher?: string
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
      const res = await fetch('/api/bookmarks', { cache: 'no-store' })
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

  // Add to bookmarks (optimistic update)
  const addBookmark = useCallback(async (bookId: number) => {
    if (!session?.user) {
      return false
    }

    // Optimistic update
    setFavoriteIds(prev => new Set([...prev, bookId]))

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      })

      if (!res.ok) {
        // Rollback on error
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(bookId)
          return newSet
        })
        return false
      }
      return true
    } catch (error) {
      console.error('Error adding bookmark:', error)
      // Rollback on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(bookId)
        return newSet
      })
      return false
    }
  }, [session?.user])

  // Remove from bookmarks (optimistic update)
  const removeBookmark = useCallback(async (bookId: number) => {
    // Optimistic update
    setFavoriteIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(bookId)
      return newSet
    })

    try {
      const res = await fetch(`/api/bookmarks?bookId=${bookId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        // Rollback on error
        setFavoriteIds(prev => new Set([...prev, bookId]))
        return false
      }
      setBookmarks(prev => prev.filter(b => b.bookId !== bookId))
      return true
    } catch (error) {
      console.error('Error removing bookmark:', error)
      // Rollback on error
      setFavoriteIds(prev => new Set([...prev, bookId]))
      return false
    }
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
