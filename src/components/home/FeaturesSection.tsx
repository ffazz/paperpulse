'use client'

import { HiBolt, HiSparkles, HiGlobeAlt } from 'react-icons/hi2'
import { motion } from 'framer-motion'

export default function FeaturesSection() {
  const features = [
    {
      icon: HiBolt,
      title: 'Smart Matching',
      description: 'AI-powered similarity algorithm analyzes vibes, themes, and genres to find your perfect match'
    },
    {
      icon: HiSparkles,
      title: 'Mood Search',
      description: 'Find books by feeling: dark academia, romantic, melancholic, uplifting, and more'
    },
    {
      icon: HiGlobeAlt,
      title: 'Bilingual',
      description: 'Indonesian and international books from 2020-2025. All rated 4.0+ on Goodreads'
    },
  ]

  return (
    <section className="container py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Why <span className="text-accent">PaperPulse</span>?
        </h2>
        <p className="text-xl text-midnight/60 max-w-2xl mx-auto">
          More than just recommendations. It's about the vibe.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-3xl border border-midnight/5 hover:border-midnight/10 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-midnight/5 group-hover:bg-accent/10 flex items-center justify-center mb-6 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-midnight/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
