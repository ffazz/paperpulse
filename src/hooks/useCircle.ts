import { useState, useCallback } from 'react'

interface UseCircleProps {
  postId?: string
  userId?: string
  bookId?: string
}

export const useCircle = ({ postId, userId, bookId }: UseCircleProps = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create post
  const createPost = useCallback(
    async (data: {
      title: string
      content: string
      category: string
      bookId?: number
      tags?: string[]
    }) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/circle/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create post')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create post'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Edit post
  const editPost = useCallback(
    async (
      id: string,
      data: {
        title?: string
        content?: string
        category?: string
        tags?: string[]
      }
    ) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/circle/posts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to edit post')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to edit post'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Delete post
  const deletePost = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/circle/posts/${id}`, {
          method: 'DELETE'
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to delete post')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete post'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Create comment
  const createComment = useCallback(
    async (data: { content: string; parentId?: string }) => {
      if (!postId) throw new Error('Post ID is required')

      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/circle/posts/${postId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create comment')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create comment'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [postId]
  )

  // Edit comment
  const editComment = useCallback(
    async (commentId: string, data: { content: string }) => {
      if (!postId) throw new Error('Post ID is required')

      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/circle/posts/${postId}/comments/${commentId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }
        )

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to edit comment')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to edit comment'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [postId]
  )

  // Delete comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!postId) throw new Error('Post ID is required')

      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/circle/posts/${postId}/comments/${commentId}`,
          {
            method: 'DELETE'
          }
        )

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to delete comment')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete comment'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [postId]
  )

  // Toggle post like
  const togglePostLike = useCallback(
    async (id: string) => {
      setError(null)
      try {
        const res = await fetch(`/api/circle/posts/${id}/likes`, {
          method: 'POST'
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to toggle like')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to toggle like'
        setError(message)
        throw err
      }
    },
    []
  )

  // Toggle comment like
  const toggleCommentLike = useCallback(
    async (commentId: string) => {
      if (!postId) throw new Error('Post ID is required')

      setError(null)
      try {
        const res = await fetch(
          `/api/circle/posts/${postId}/comments/${commentId}/likes`,
          {
            method: 'POST'
          }
        )

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to toggle like')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to toggle like'
        setError(message)
        throw err
      }
    },
    [postId]
  )

  // Search posts
  const searchPosts = useCallback(
    async (query: string, filters?: { category?: string; authorId?: string }) => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ q: query, limit: '10', page: '1' })
        if (filters?.category) params.append('category', filters.category)
        if (filters?.authorId) params.append('authorId', filters.authorId)

        const res = await fetch(`/api/circle/posts/search?${params}`)

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to search posts')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to search posts'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Get trending posts
  const getTrendingPosts = useCallback(
    async (timeRange: '7d' | '30d' | 'all' = '7d') => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/circle/posts/trending?timeRange=${timeRange}&limit=10`
        )

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to fetch trending posts')
        }

        return await res.json()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch trending posts'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    loading,
    error,
    createPost,
    editPost,
    deletePost,
    createComment,
    editComment,
    deleteComment,
    togglePostLike,
    toggleCommentLike,
    searchPosts,
    getTrendingPosts
  }
}
