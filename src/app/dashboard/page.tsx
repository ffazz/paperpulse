import { Suspense } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import ChartsSection from '@/components/dashboard/ChartsSection'
import DashboardLoading from './loading'

async function getInsights() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/insights`, {
    cache: 'no-store',
  })
  return response.json()
}

export default async function DashboardPage() {
  const insights = await getInsights()

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            Insights <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-xl text-midnight/60">
            Explore patterns and trends in our book collection
          </p>
        </div>

        {/* Stats Cards */}
        <Suspense fallback={<DashboardLoading />}>
          <StatsCards insights={insights} />
        </Suspense>

        {/* Charts Section */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-midnight/5 rounded-3xl" />}>
          <ChartsSection insights={insights} />
        </Suspense>
      </div>
    </div>
  )
}
