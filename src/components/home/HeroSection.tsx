'use client'

import Link from 'next/link'
import { HiArrowRight, HiSparkles } from 'react-icons/hi2'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative container py-16 sm:py-24 md:py-32 lg:py-48">
      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-midnight/5 backdrop-blur-sm text-xs sm:text-sm"
        >
          <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent animate-pulse" />
          <span className="font-medium">Discover your next favorite read</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-none"
        >
          <span className="block text-midnight">feel the</span>
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-accent via-glow to-accent bg-200 animate-gradient">
            vibes
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-midnight/60 max-w-3xl mx-auto leading-relaxed"
        >
          Smart book recommendations powered by mood, theme, and genre.
          <br />
          Find books that match your energy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8"
        >
          <Link href="/books" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-midnight text-ghost rounded-full font-medium text-sm sm:text-base shadow-2xl hover:shadow-accent/20 transition-all duration-300"
            >
              <span>Start Exploring</span>
              <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <Link href="/dashboard" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-midnight/10 rounded-full font-medium text-sm sm:text-base text-midnight hover:border-midnight/30 hover:bg-midnight/5 transition-all duration-300 backdrop-blur-sm bg-white/50"
            >
              <span>View Insights</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-midnight/20 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-midnight/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
