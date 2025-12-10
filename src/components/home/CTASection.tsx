'use client'

import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="container py-16 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight to-accent/20" />
        
        {/* Animated gradient orb */}
        <div className="absolute top-0 right-0 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" />
        
        {/* Content */}
        <div className="relative text-center space-y-4 md:space-y-6 lg:space-y-8 px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20 text-ghost">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Ready to find your
            <br />
            <span className="text-accent">next favorite?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg lg:text-xl text-ghost/70 max-w-2xl mx-auto"
          >
            Browse 100+ curated books and get personalized recommendations based on your vibe
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/books">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-ghost text-midnight rounded-full font-medium text-sm md:text-base shadow-2xl hover:shadow-ghost/20 transition-shadow"
              >
                Start Now
                <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
