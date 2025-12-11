'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { HiArrowLeft, HiPencil, HiMapPin, HiCalendar, HiGlobeAlt } from 'react-icons/hi2'
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'

interface ProfileData {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    bio: string | null
    location: string | null
    website: string | null
    twitter: string | null
    instagram: string | null
    goodreads: string | null
    favoriteGenres: string[]
    coverImage: string | null
    theme: string
    isPublic: boolean
    showReadingGoal: boolean
    showEmail: boolean
    createdAt: string
  }
  stats: {
    totalBooksRead: number
    totalLists: number
    totalPosts: number
    totalReviews: number
    profileViews?: number
    readingStreak: number
    longestStreak: number
  }
  currentGoal: {
    year: number
    targetBooks: number
    currentBooks: number
    inProgressBooks: number
    percentage: number
  } | null
  achievements: Array<{
    id: string
    name: string
    icon: string
    unlocked: boolean
  }>
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const userId = params.userId as string
  const isOwnProfile = session?.user?.id === userId

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container pt-24 pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <HiArrowLeft /> Go Back
        </button>
      </div>
    )
  }

  const { user, stats, currentGoal, achievements } = profileData
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        {isOwnProfile && (
          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-lg hover:bg-white">
            Change Cover
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-24 relative z-10">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={150}
                  height={150}
                  className="w-40 h-40 rounded-full border-6 border-white shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 rounded-full border-6 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {(user.name || 'U')[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-lg text-gray-600 mt-1">@{user.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}</p>
              
              {user.bio && (
                <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-2 text-gray-600">
                    <HiMapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                )}
                <span className="flex items-center gap-2 text-gray-600">
                  <HiCalendar className="w-4 h-4" />
                  Joined {joinedDate}
                </span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:text-blue-500 transition">
                    <HiGlobeAlt className="w-5 h-5" />
                  </a>
                )}
                {user.twitter && (
                  <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:text-blue-500 transition">
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                )}
                {user.instagram && (
                  <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:text-pink-500 transition">
                    <FaInstagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  <HiPencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-500">{stats.totalBooksRead}</p>
              <p className="text-gray-600 mt-2">Books Read</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-purple-500">{stats.totalLists}</p>
              <p className="text-gray-600 mt-2">Reading Lists</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-green-500">{stats.totalPosts}</p>
              <p className="text-gray-600 mt-2">Circle Posts</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-yellow-500">{stats.totalReviews}</p>
              <p className="text-gray-600 mt-2">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b mb-8 overflow-x-auto">
            {['overview', 'lists', 'posts', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Reading Goal */}
              {currentGoal && user.showReadingGoal && (
                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-bold mb-4">{currentGoal.year} Reading Goal</h2>
                  <div className="flex items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="60" className="fill-none stroke-gray-200" strokeWidth="8" />
                          <circle
                            cx="64"
                            cy="64"
                            r="60"
                            className="fill-none stroke-blue-500 transition-all"
                            strokeWidth="8"
                            strokeDasharray={`${(currentGoal.percentage / 100) * 376.99} 376.99`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{currentGoal.percentage}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold mb-4">
                        {currentGoal.currentBooks} of {currentGoal.targetBooks} books read
                      </p>
                      <div className="space-y-2">
                        <p className="text-gray-600">In Progress: {currentGoal.inProgressBooks}</p>
                        <p className="text-gray-600">Remaining: {currentGoal.targetBooks - currentGoal.currentBooks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {achievements.some(a => a.unlocked) && (
                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-xl font-bold mb-4">Achievements</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                          achievement.unlocked
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        }`}
                        title={achievement.name}
                      >
                        <span className="text-3xl">{achievement.icon}</span>
                        <span className="text-xs text-center font-medium">{achievement.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Reading lists coming soon</p>
              <Link href="/reading-lists" className="text-blue-500 hover:underline">
                View all reading lists
              </Link>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Circle posts coming soon</p>
              <Link href="/circle" className="text-blue-500 hover:underline">
                View Circle forum
              </Link>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Activity timeline coming soon</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
