import Charts from '@/components/Charts'
import { Card } from '@/components/ui/Card'
import { formatNumber, formatRating } from '@/lib/utils'

async function getInsights() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/insights`, {
    cache: 'no-store',
  })
  return response.json()
}

export default async function DashboardPage() {
  const insights = await getInsights()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          📊 Dashboard Analytics
        </h1>
        <p className="text-gray-600">
          Visualisasi dan statistik dataset buku
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-4xl mb-2">📚</div>
          <div className="text-3xl font-bold text-gray-800">
            {formatNumber(insights.totalBooks)}
          </div>
          <div className="text-sm text-gray-600">Total Buku</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-gray-800">
            {formatRating(insights.averageRating)}
          </div>
          <div className="text-sm text-gray-600">Rating Rata-rata</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <div className="text-3xl font-bold text-gray-800">
            {Math.round(insights.averagePages)}
          </div>
          <div className="text-sm text-gray-600">Rata-rata Halaman</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-3xl font-bold text-gray-800">
            {insights.yearRange.min}-{insights.yearRange.max}
          </div>
          <div className="text-sm text-gray-600">Rentang Tahun</div>
        </Card>
      </div>

      {/* Charts */}
      <Charts insights={insights} />
    </div>
  )
}
