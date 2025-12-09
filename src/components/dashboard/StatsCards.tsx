'use client'

import { motion } from 'framer-motion'
import { HiBookOpen, HiStar, HiDocumentText, HiCalendar } from 'react-icons/hi2'
import { DatasetInsights } from '@/types'

interface StatsCardsProps {
  insights: DatasetInsights
}

export default function StatsCards({ insights }: StatsCardsProps) {
  const stats = [
    {
      icon: HiBookOpen,
      label: 'Total Books',
      value: insights.totalBooks.toString(),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HiStar,
      label: 'Avg Rating',
      value: insights.averageRating.toFixed(1),
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: HiDocumentText,
      label: 'Avg Pages',
      value: Math.round(insights.averagePages).toString(),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: HiCalendar,
      label: 'Year Range',
      value: `${insights.yearRange.min}-${insights.yearRange.max}`,
      color: 'from-emerald-500 to-teal-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-3xl border border-midnight/5 hover:border-midnight/10 bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative p-8 space-y-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              <div>
                <div className="text-4xl font-bold text-midnight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-midnight/60 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
