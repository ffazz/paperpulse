'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { HiBookOpen, HiChartBar, HiUser, HiArrowRightOnRectangle, HiHeart, HiChatBubbleLeftRight, HiEllipsisHorizontalCircle } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { href: '/books', label: 'Browse', icon: HiBookOpen },
    { href: '/dashboard', label: 'Insights', icon: HiChartBar },
  ]

  const authenticatedNavItems = [
    { href: '/favorites', label: 'Favorites', icon: HiHeart },
    { href: '/reading-lists', label: 'Lists', icon: HiEllipsisHorizontalCircle },
    { href: '/circle', label: 'Circle', icon: HiChatBubbleLeftRight },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-ghost/80 border-b border-midnight/5"
    >
      <nav className="container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Logo variant="small" size={32} priority />

          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Main Navigation */}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full
                      text-xs sm:text-sm font-medium transition-colors
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

            {/* Authenticated Navigation */}
            {session && authenticatedNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full
                      text-xs sm:text-sm font-medium transition-colors
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

            {/* Auth Section */}
            <div className="ml-2 sm:ml-4 flex items-center gap-2">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-midnight/10 animate-pulse" />
              ) : session ? (
                <div className="flex items-center gap-2">
                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
                    >
                      <HiUser className="w-4 h-4 text-accent" />
                      <span className="text-xs sm:text-sm font-medium text-midnight hidden sm:inline">
                        {session.user?.name?.split(' ')[0] || 'User'}
                      </span>
                    </motion.button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-midnight">{session.user?.name}</p>
                          <p className="text-xs text-gray-600">{session.user?.email}</p>
                        </div>
                        <Link href={`/users/${session.user?.id}`}>
                          <div
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-midnight hover:bg-midnight/5 transition-colors cursor-pointer"
                          >
                            <HiUser className="w-4 h-4" />
                            View Profile
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ redirect: true, redirectTo: '/' })
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <HiArrowRightOnRectangle className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link href="/auth/signin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-midnight hover:bg-midnight/5 rounded-full transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/auth/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-ghost bg-accent rounded-full hover:shadow-lg hover:shadow-accent/30 transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
