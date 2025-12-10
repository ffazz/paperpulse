'use client'

import { motion } from 'framer-motion'
import { HiBookOpen, HiStar, HiDocumentText, HiCalendar } from 'react-icons/hi2'

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
  // Default values if insights is undefined
  const totalBooks = insights?.totalBooks || 0
  const indonesianBooks = insights?.indonesianBooks || 0
  const internationalBooks = insights?.internationalBooks || 0
  const averageRating = insights?.averageRating || 0
  const averagePages = insights?.averagePages || 0
  const yearMin = insights?.yearRange?.min || new Date().getFullYear()
  const yearMax = insights?.yearRange?.max || new Date().getFullYear()

  const stats = [
    {
      icon: HiBookOpen,
      label: 'Total Books',
      value: totalBooks.toString(),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HiBookOpen,
      label: 'Indonesian',
      value: indonesianBooks.toString(),
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: HiBookOpen,
      label: 'International',
      value: internationalBooks.toString(),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: HiCalendar,
      label: 'Year Range',
      value: `${yearMin}-${yearMax}`,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-12 md:mb-16">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-midnight/5 hover:border-midnight/10 bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-midnight mb-0.5 md:mb-1 break-words">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm lg:text-sm text-midnight/60 font-medium">
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
