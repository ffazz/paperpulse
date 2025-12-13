'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'main' | 'small'
  size?: number
  priority?: boolean
  clickable?: boolean
  className?: string
  href?: string
}

export function Logo({
  variant = 'main',
  size = 40,
  priority = false,
  clickable = true,
  className,
  href = '/',
}: LogoProps) {
  const imagePath = variant === 'main' ? '/logo1.png' : '/logo2.png'

  const content = (
    <motion.div
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      className={cn('relative', clickable && 'cursor-pointer')}
    >
      <Image
        src={imagePath}
        alt="PaperPulse Logo"
        width={size}
        height={size}
        priority={priority}
        className={cn('h-auto w-auto', className)}
        quality={95}
      />
    </motion.div>
  )

  if (!clickable) {
    return content
  }

  return <Link href={href}>{content}</Link>
}

export function LogoWithText({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Image
          src="/logo2.png"
          alt="PaperPulse"
          width={size}
          height={size}
          quality={95}
          priority
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <span className="text-lg font-bold text-midnight group-hover:text-accent transition-colors">
          Paper
          <span className="text-accent">Pulse</span>
        </span>
        <span className="text-xs text-gray-600 -mt-1">Discover Reading</span>
      </motion.div>
    </Link>
  )
}
