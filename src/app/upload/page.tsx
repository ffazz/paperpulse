'use client'

import { motion } from 'framer-motion'
import UploadZone from '@/components/upload/UploadZone'
import SampleDataCard from '@/components/upload/SampleDataCard'

export default function UploadPage() {
  return (
    <div className="min-h-screen pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 lg:mb-16 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-2 md:mb-3 lg:mb-4">
            Upload <span className="text-accent">Dataset</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-midnight/60 max-w-2xl mx-auto">
            Add your own book collection or use our curated sample data
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 md:mb-10 lg:mb-12"
        >
          <UploadZone />
        </motion.div>

        {/* Sample Data Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SampleDataCard />
        </motion.div>
      </div>
    </div>
  )
}
