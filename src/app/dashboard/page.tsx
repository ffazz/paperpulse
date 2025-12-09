import { Suspense } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import ChartsSection from '@/components/dashboard/ChartsSection'
import DashboardLoading from './loading'

async function getInsights() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/insights`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch insights')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching insights:', error)
    return {
      totalBooks: 0,
      indonesianBooks: 0,
      internationalBooks: 0,
      averageRating: 0,
      averagePages: 0,
      yearRange: {
        min: new Date().getFullYear(),
        max: new Date().getFullYear(),
      },
      topSubjects: [],
      languageDistribution: [],
      genreDistribution: [],
    }
  }
}

export default async function DashboardPage() {
  const insights = await getInsights()

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-accent/5 to-white">
      <div className="container">
        {/* Header - Simple, No Animation */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Insights <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-xl text-midnight/60 max-w-3xl mx-auto">
            Discover patterns, trends, and statistics from our curated collection of{' '}
            <span className="font-semibold text-accent">{insights.totalBooks}</span> books
          </p>
        </div>

        {/* Stats Cards */}
        <Suspense fallback={<DashboardLoading />}>
          <StatsCards insights={insights} />
        </Suspense>

        {/* Charts Section */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-white rounded-3xl" />}>
          <ChartsSection insights={insights} />
        </Suspense>
      </div>
    </div>
  )
}
