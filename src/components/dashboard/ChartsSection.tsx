'use client'

import { motion } from 'framer-motion'

interface ChartsSectionProps {
  insights: {
    topSubjects?: Array<{ name: string; count: number }>
    languageDistribution?: Array<{ name: string; count: number }>
    genreDistribution?: Array<{ name: string; count: number }>
    totalBooks?: number
  }
}

export default function ChartsSection({ insights }: ChartsSectionProps) {
  // Safely extract data with fallbacks
  const genreData = insights?.genreDistribution || insights?.topSubjects || []
  const languageData = insights?.languageDistribution || []

  // Find max values for scaling
  const maxGenre = genreData.length > 0 ? Math.max(...genreData.map(d => d.count)) : 1
  const maxLang = languageData.length > 0 ? Math.max(...languageData.map(d => d.count)) : 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
      {/* Top Subjects Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-bold mb-6">Top Subjects</h3>
        <div className="space-y-4">
          {genreData.length > 0 ? (
            genreData.map((genre, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate pr-2">{genre.name}</span>
                  <span className="text-midnight/60 whitespace-nowrap">{genre.count}</span>
                </div>
                <div className="w-full bg-midnight/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(genre.count / maxGenre) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-midnight/60">
              No subject data available
            </div>
          )}
        </div>
      </motion.div>

      {/* Language Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-bold mb-6">Language Distribution</h3>
        <div className="space-y-4">
          {languageData.length > 0 ? (
            languageData.map((lang, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-midnight/60 whitespace-nowrap">{lang.count}</span>
                </div>
                <div className="w-full bg-midnight/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(lang.count / maxLang) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-midnight to-midnight/80 rounded-full"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-midnight/60">
              No language data available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
