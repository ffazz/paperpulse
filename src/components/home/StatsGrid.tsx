'use client'

import { motion } from 'framer-motion'

interface StatsGridProps {
  stats: {
    total: number
    indonesian: number
    english: number
  }
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statsData = [
    { value: stats.total, label: 'Books' },
    { value: stats.indonesian, label: 'Indonesian' },
    { value: stats.english, label: 'International' },
  ]

  return (
    <section className="container py-20">
      <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
        {statsData.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
              className="text-6xl md:text-7xl font-bold text-midnight mb-2"
            >
              {stat.value}
            </motion.div>
            <div className="text-sm text-midnight/40 uppercase tracking-wider font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
