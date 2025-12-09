'use client'

import { motion } from 'framer-motion'

interface StatsGridProps {
  stats: {
    total: number
    indonesian: number
    international: number
  }
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statsData = [
    { 
      value: stats.indonesian, 
      label: 'Indonesian Books',
      emoji: '🇮🇩',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      value: stats.international, 
      label: 'International Books',
      emoji: '🌍',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      value: stats.total, 
      label: 'Total Books',
      emoji: '📚',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
  ]

  return (
    <section className="container py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {statsData.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`text-center p-8 rounded-2xl ${stat.bgColor} border border-gray-100 shadow-lg hover:shadow-xl transition-shadow`}
          >
            {/* Emoji Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-5xl mb-4"
            >
              {stat.emoji}
            </motion.div>

            {/* Number */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
              className={`text-5xl md:text-6xl font-bold ${stat.color} mb-3`}
            >
              {stat.value.toLocaleString()}
            </motion.div>

            {/* Label */}
            <div className="text-sm text-midnight/60 uppercase tracking-wider font-semibold">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
