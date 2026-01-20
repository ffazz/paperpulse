'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiBookOpen, HiHeart, HiChatBubbleLeft, HiCheckCircle, HiEye, HiStar } from 'react-icons/hi2'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'READ' | 'LIST_CREATED' | 'POST_CREATED' | 'REVIEW_CREATED' | 'GOAL_COMPLETED' | 'GOAL_CREATED'
  metadata: Record<string, any>
  createdAt: string
}

interface ActivityTimelineProps {
  userId: string
  isOwner: boolean
}

const activityTypeConfig = {
  READ: {
    icon: HiCheckCircle,
    color: 'bg-green-100 text-green-600',
    label: 'Completed'
  },
  LIST_CREATED: {
    icon: HiBookOpen,
    color: 'bg-blue-100 text-blue-600',
    label: 'Created List'
  },
  POST_CREATED: {
    icon: HiChatBubbleLeft,
    color: 'bg-purple-100 text-purple-600',
    label: 'Posted'
  },
  REVIEW_CREATED: {
    icon: HiStar,
    color: 'bg-yellow-100 text-yellow-600',
    label: 'Reviewed'
  },
  GOAL_COMPLETED: {
    icon: HiCheckCircle,
    color: 'bg-red-100 text-red-600',
    label: 'Goal Completed'
  },
  GOAL_CREATED: {
    icon: HiEye,
    color: 'bg-indigo-100 text-indigo-600',
    label: 'Set Goal'
  }
}

export function ActivityTimeline({ userId, isOwner }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}/activity?offset=0&limit=10`)
      if (!res.ok) throw new Error('Failed to fetch activities')
      const data = await res.json()
      setActivities(data.activities || [])
      setHasMore(data.hasMore ?? false)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    try {
      const newOffset = offset + 10
      const res = await fetch(`/api/users/${userId}/activity?offset=${newOffset}&limit=10`)
      if (!res.ok) throw new Error('Failed to fetch activities')
      const data = await res.json()
      setActivities(prev => [...prev, ...(data.activities || [])])
      setOffset(newOffset)
      setHasMore(data.hasMore ?? false)
    } catch (error) {
      console.error('Error loading more activities:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No activities yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200" />

        {/* Activities */}
        <div className="space-y-8">
          {activities.map((activity, index) => {
            const config = activityTypeConfig[activity.type as keyof typeof activityTypeConfig]
            const Icon = config?.icon || HiBookOpen
            const createdDate = new Date(activity.createdAt)
            const isToday = new Date().toDateString() === createdDate.toDateString()
            const isYesterday = new Date(Date.now() - 86400000).toDateString() === createdDate.toDateString()

            let dateLabel = createdDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: createdDate.getFullYear() !== new Date().getFullYear() ? '2-digit' : undefined
            })

            if (isToday) dateLabel = 'Today'
            if (isYesterday) dateLabel = 'Yesterday'

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Icon bubble */}
                <div className={`absolute -left-3 top-0 w-12 h-12 ${config?.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg p-4 border hover:border-blue-200 transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{config?.label}</h3>
                    <span className="text-xs text-gray-500">{dateLabel}</span>
                  </div>

                  {/* Activity-specific content */}
                  {activity.type === 'READ' && activity.metadata.bookTitle && (
                    <p className="text-gray-700">
                      Finished reading <strong>{activity.metadata.bookTitle}</strong> by {activity.metadata.author}
                    </p>
                  )}

                  {activity.type === 'LIST_CREATED' && activity.metadata.listName && (
                    <p className="text-gray-700">
                      Created reading list <Link href={`/reading-lists/${activity.metadata.listId}`} className="font-semibold text-blue-500 hover:underline">{activity.metadata.listName}</Link>
                    </p>
                  )}

                  {activity.type === 'POST_CREATED' && activity.metadata.postTitle && (
                    <p className="text-gray-700">
                      Posted <Link href={`/circle/posts/${activity.metadata.postId}`} className="font-semibold text-blue-500 hover:underline">{activity.metadata.postTitle}</Link> in Circle
                    </p>
                  )}

                  {activity.type === 'REVIEW_CREATED' && activity.metadata.bookTitle && (
                    <div>
                      <p className="text-gray-700">
                        Reviewed <strong>{activity.metadata.bookTitle}</strong>
                      </p>
                      {activity.metadata.rating && (
                        <div className="mt-2 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <HiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < activity.metadata.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {activity.metadata.review && (
                        <p className="mt-2 text-gray-600 italic">&quot;{activity.metadata.review.substring(0, 100)}...&quot;</p>
                      )}
                    </div>
                  )}

                  {activity.type === 'GOAL_COMPLETED' && activity.metadata.year && (
                    <p className="text-gray-700">
                      Completed {activity.metadata.year} reading goal: <strong>{activity.metadata.booksRead} books</strong> read
                    </p>
                  )}

                  {activity.type === 'GOAL_CREATED' && activity.metadata.year && (
                    <p className="text-gray-700">
                      Set {activity.metadata.year} reading goal: <strong>{activity.metadata.target} books</strong>
                    </p>
                  )}

                  {/* Time */}
                  <p className="text-xs text-gray-500 mt-3">
                    {createdDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
