'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiBookmark, HiAcademicCap, HiChartBar, HiSparkles } from 'react-icons/hi2'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string, startsWith?: string) => {
    if (href === '/') return pathname === '/'
    if (startsWith) return pathname === href || pathname.startsWith(startsWith)
    return pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-midnight/5 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="text-2xl sm:text-3xl"
            >
              📚
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                <span className="text-midnight">Paper</span>
                <span className="text-accent">Pulse</span>
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-6">
            {/* Browse Books */}
            <Link
              href="/books"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/books', '/books/')
                  ? 'text-accent bg-accent/10'
                  : 'text-midnight/60 hover:text-midnight hover:bg-midnight/5'
              }`}
            >
              <HiAcademicCap className="w-4 h-4" />
              <span className="hidden lg:inline">Browse</span>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'text-accent bg-accent/10'
                  : 'text-midnight/60 hover:text-midnight hover:bg-midnight/5'
              }`}
            >
              <HiChartBar className="w-4 h-4" />
              <span className="hidden lg:inline">Insights</span>
            </Link>

            {/* Reading Lists - HIGHLIGHTED */}
            <Link
              href="/reading-lists"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/reading-lists', '/reading-lists/')
                  ? 'text-white bg-gradient-to-r from-accent to-red-500 shadow-lg shadow-accent/30 scale-105'
                  : 'text-midnight/60 hover:text-midnight hover:bg-midnight/5'
              }`}
            >
              <HiBookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Lists</span>
            </Link>

            {/* Explore CTA */}
            <Link
              href="/books"
              className="hidden md:flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-accent to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 transform hover:scale-105 text-sm"
            >
              <HiSparkles className="w-4 h-4" />
              Explore
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
