'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-3xl"
            >
              📚
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                PaperPulse
              </h1>
              <p className="text-xs text-midnight/50">Discover Your Next Read</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-accent'
                  : 'text-midnight/60 hover:text-accent'
              }`}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`font-semibold transition-colors ${
                pathname === '/books' || pathname.startsWith('/books/')
                  ? 'text-accent'
                  : 'text-midnight/60 hover:text-accent'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/books"
              className="px-5 py-2.5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-lg font-semibold hover:from-accent/90 hover:to-purple-600/90 transition-all transform hover:scale-105 shadow-md"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
