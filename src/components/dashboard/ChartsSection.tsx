'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DatasetInsights } from '@/types'

interface ChartsSectionProps {
  insights: DatasetInsights
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function ChartsSection({ insights }: ChartsSectionProps) {
  const genreData = Object.entries(insights.genreDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const languageData = Object.entries(insights.languageDistribution).map(([name, value]) => ({
    name: name === 'Indonesian' ? 'Indonesia' : name,
    value,
  }))

  const ratingData = Object.entries(insights.ratingDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  const topVibes = Object.entries(insights.vibesFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-8">
      {/* Genre Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-accent to-glow rounded-full" />
          Genre Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0a0a0a" strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={120}
              tick={{ fill: '#0a0a0a', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#0a0a0a', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid rgba(10, 10, 10, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Language & Rating */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            Language Split
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(10, 10, 10, 0.1)',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            Rating Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0a0a0a" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fill: '#0a0a0a', fontSize: 12 }} />
              <YAxis tick={{ fill: '#0a0a0a', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(10, 10, 10, 0.1)',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Vibes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-3xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Top Vibes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVibes} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#0a0a0a" strokeOpacity={0.1} />
            <XAxis type="number" tick={{ fill: '#0a0a0a', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#0a0a0a', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid rgba(10, 10, 10, 0.1)',
                borderRadius: '12px'
              }}
            />
            <Bar dataKey="value" fill="url(#vibesGradient)" radius={[0, 8, 8, 0]} />
            <defs>
              <linearGradient id="vibesGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
