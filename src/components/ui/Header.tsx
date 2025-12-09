'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiBookOpen, HiChartBar, HiCloudArrowUp } from 'react-icons/hi2'
import { motion } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/books', label: 'Browse', icon: HiBookOpen },
    { href: '/dashboard', label: 'Insights', icon: HiChartBar },
    { href: '/upload', label: 'Upload', icon: HiCloudArrowUp }, // ← Changed
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-ghost/80 border-b border-midnight/5"
    >
      <nav className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold tracking-tighter"
            >
              <span className="text-midnight">Paper</span>
              <span className="text-accent">Pulse</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full
                      text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-midnight text-ghost' 
                        : 'text-midnight/60 hover:text-midnight hover:bg-midnight/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
