'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DatasetInsights } from '@/types'

interface ChartsProps {
  insights: DatasetInsights
}

const COLORS = ['#0891b2', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#164e63', '#155e75']

export default function Charts({ insights }: ChartsProps) {
  const genreData = Object.entries(insights.genreDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  const ratingData = Object.entries(insights.ratingDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  const languageData = Object.entries(insights.languageDistribution).map(([name, value]) => ({
    name: name === 'Indonesian' ? 'Indonesia' : name,
    value,
  }))

  const topVibes = Object.entries(insights.vibesFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-8">
      {/* Genre Distribution */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📊 Distribusi Genre
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0891b2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Language Distribution */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🌍 Distribusi Bahasa
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={languageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {languageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Rating Distribution */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ⭐ Distribusi Rating
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Vibes */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ✨ Top 10 Vibes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVibes} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#0369a1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}