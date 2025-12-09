'use client'

import { motion } from 'framer-motion'
import { HiBookOpen, HiGlobeAlt, HiSparkles, HiCalendar } from 'react-icons/hi2'

interface StatsCardsProps {
  insights?: {
    totalBooks?: number
    indonesianBooks?: number
    internationalBooks?: number
    averageRating?: number
    averagePages?: number
    yearRange?: {
      min: number
      max: number
    }
  }
}

export default function StatsCards({ insights }: StatsCardsProps) {
  const stats = [
    {
      icon: HiBookOpen,
      value: insights?.totalBooks?.toString() || '0',
      label: 'Total Books',
      color: 'from-accent to-accent/80',
      bgColor: 'bg-accent/10',
    },
    {
      icon: HiSparkles,
      value: insights?.indonesianBooks?.toString() || '0',
      label: 'Indonesian Books',
      color: 'from-midnight to-midnight/80',
      bgColor: 'bg-midnight/10',
    },
    {
      icon: HiGlobeAlt,
      value: insights?.internationalBooks?.toString() || '0',
      label: 'International Books',
      color: 'from-accent to-midnight',
      bgColor: 'bg-gradient-to-br from-accent/10 to-midnight/10',
    },
    {
      icon: HiCalendar,
      value: insights?.yearRange 
        ? `${insights.yearRange.min} - ${insights.yearRange.max}` 
        : 'N/A',
      label: 'Publication Years',
      color: 'from-midnight/80 to-accent/80',
      bgColor: 'bg-gradient-to-br from-midnight/5 to-accent/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`
              group relative overflow-hidden
              ${stat.bgColor}
              backdrop-blur-sm
              rounded-3xl p-8
              border border-midnight/5
              hover:border-accent/20
              transition-all duration-300
              hover:shadow-2xl hover:shadow-accent/10
              hover:-translate-y-1
            `}
          >
            {/* Gradient Overlay on Hover */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-10
              bg-gradient-to-br ${stat.color}
              transition-opacity duration-300
            `} />

            <div className="relative z-10">
              {/* Icon */}
              <div className={`
                inline-flex p-4 rounded-2xl mb-6
                bg-gradient-to-br ${stat.color}
                text-white
                transform group-hover:scale-110 group-hover:rotate-3
                transition-transform duration-300
              `}>
                <Icon className="w-8 h-8" />
              </div>

              {/* Value */}
              <div className={`
                text-4xl md:text-5xl font-bold mb-2
                bg-gradient-to-br ${stat.color}
                bg-clip-text text-transparent
              `}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-midnight/60 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
