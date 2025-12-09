'use client'

import { motion } from 'framer-motion'
import { HiChartBar, HiGlobeAlt } from 'react-icons/hi2'

interface ChartsSectionProps {
  insights: {
    topSubjects?: Array<{ name: string; count: number }>
    languageDistribution?: Array<{ name: string; count: number }>
    genreDistribution?: Array<{ name: string; count: number }>
    totalBooks?: number
  }
}

export default function ChartsSection({ insights }: ChartsSectionProps) {
  const genreData = insights?.genreDistribution || insights?.topSubjects || []
  const languageData = insights?.languageDistribution || []

  const maxGenre = genreData.length > 0 ? Math.max(...genreData.map(d => d.count)) : 1
  const maxLang = languageData.length > 0 ? Math.max(...languageData.map(d => d.count)) : 1

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Collection <span className="text-accent">Analytics</span>
        </h2>
        <p className="text-lg text-midnight/60">
          Deep dive into our book collection distribution
        </p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Subjects Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-white/80 backdrop-blur-sm
            rounded-3xl p-8 
            border border-midnight/5
            hover:border-accent/20
            transition-all duration-300
            shadow-lg hover:shadow-2xl hover:shadow-accent/10
          "
        >
          {/* Chart Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-2xl">
              <HiChartBar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-midnight">Top Subjects</h3>
              <p className="text-sm text-midnight/60">Most popular book topics</p>
            </div>
          </div>

          {/* Chart Content */}
          <div className="space-y-5">
            {genreData.length > 0 ? (
              genreData.map((genre, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-midnight truncate pr-4">
                      {genre.name}
                    </span>
                    <span className="text-sm text-midnight/60 whitespace-nowrap font-medium">
                      {genre.count} books
                    </span>
                  </div>
                  <div className="relative w-full bg-midnight/5 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(genre.count / maxGenre) * 100}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      className="
                        h-full 
                        bg-gradient-to-r from-accent via-accent/90 to-accent/80
                        rounded-full
                        relative
                      "
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-midnight/5 flex items-center justify-center">
                  <HiChartBar className="w-8 h-8 text-midnight/30" />
                </div>
                <p className="text-midnight/60">No subject data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Language Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            bg-white/80 backdrop-blur-sm
            rounded-3xl p-8 
            border border-midnight/5
            hover:border-midnight/20
            transition-all duration-300
            shadow-lg hover:shadow-2xl hover:shadow-midnight/10
          "
        >
          {/* Chart Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-midnight to-midnight/80 rounded-2xl">
              <HiGlobeAlt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-midnight">Language Distribution</h3>
              <p className="text-sm text-midnight/60">Books by language</p>
            </div>
          </div>

          {/* Chart Content */}
          <div className="space-y-5">
            {languageData.length > 0 ? (
              languageData.map((lang, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-midnight">
                      {lang.name}
                    </span>
                    <span className="text-sm text-midnight/60 whitespace-nowrap font-medium">
                      {lang.count} books
                    </span>
                  </div>
                  <div className="relative w-full bg-midnight/5 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(lang.count / maxLang) * 100}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      className="
                        h-full 
                        bg-gradient-to-r from-midnight via-midnight/90 to-midnight/80
                        rounded-full
                        relative
                      "
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-midnight/5 flex items-center justify-center">
                  <HiGlobeAlt className="w-8 h-8 text-midnight/30" />
                </div>
                <p className="text-midnight/60">No language data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
