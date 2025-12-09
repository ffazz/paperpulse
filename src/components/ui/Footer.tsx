'use client'

import { HiHeart } from 'react-icons/hi2'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-midnight/5 mt-32">
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="text-sm text-midnight/40 flex items-center gap-2">
            Made with <HiHeart className="text-red-500 w-4 h-4 animate-pulse" /> for book lovers
          </div>
          
          <div className="text-xs text-midnight/30">
            © 2025 PaperPulse · Powered by vibes
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
