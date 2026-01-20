import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/dashboard/StatsCards'
import ChartsSection from '@/components/dashboard/ChartsSection'
import DashboardLoading from './loading'

async function getInsights() {
  try {
    let books = []
    try {
      // Fetch all books directly from database
      books = await prisma.book.findMany({
        select: {
          id: true,
          language: true,
          publication_date: true,
          subjects: true,
        }
      })
    } catch (dbError) {
      // Return fallback if database fails
      return getDefaultInsights()
    }

    // Calculate statistics
    const indonesian = books.filter(b => b.language === 'Indonesian').length
    const international = books.length - indonesian
    
    // Year range
    const years = books
      .map(b => b.publication_date ? new Date(b.publication_date).getFullYear() : null)
      .filter(y => y !== null) as number[]
    
    const minYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear()
    const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear()

    // Top Subjects
    const subjectCount: Record<string, number> = {}
    books.forEach(book => {
      if (book.subjects && Array.isArray(book.subjects)) {
        book.subjects.forEach((subject: string) => {
          subjectCount[subject] = (subjectCount[subject] || 0) + 1
        })
      }
    })

    const topSubjects = Object.entries(subjectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // Language Distribution
    const langCount: Record<string, number> = {}
    books.forEach(book => {
      const lang = book.language || 'Unknown'
      langCount[lang] = (langCount[lang] || 0) + 1
    })

    const languageDistribution = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))

    return {
      totalBooks: books.length,
      indonesianBooks: indonesian,
      internationalBooks: international,
      averageRating: 0,
      averagePages: 0,
      yearRange: {
        min: minYear,
        max: maxYear,
      },
      topSubjects,
      languageDistribution,
      genreDistribution: topSubjects.slice(0, 5),
    }
  } catch (error) {
    console.error('Error fetching insights:', error)
    return getDefaultInsights()
  }
}

function getDefaultInsights() {
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

export default async function DashboardPage() {
  const insights = await getInsights()

  return (
    <div className="min-h-screen pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20 bg-gradient-to-b from-accent/5 to-white">
      <div className="container">
        {/* Header - Simple, No Animation */}
        <div className="mb-8 md:mb-12 lg:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-3 md:mb-4 lg:mb-6">
            Insights <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-midnight/60 max-w-3xl mx-auto">
            Discover patterns, trends, and statistics from our curated collection of{' '}
            <span className="font-semibold text-accent">{insights.totalBooks}</span> books
          </p>
        </div>

        {/* Stats Cards */}
        <Suspense fallback={<DashboardLoading />}>
          <StatsCards insights={insights} />
        </Suspense>

        {/* Charts Section */}
        <Suspense fallback={<div className="h-80 md:h-96 animate-pulse bg-white rounded-2xl md:rounded-3xl" />}>
          <ChartsSection insights={insights} />
        </Suspense>
      </div>
    </div>
  )
}
