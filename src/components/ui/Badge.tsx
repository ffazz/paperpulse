import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors',
        {
          'bg-midnight/5 text-midnight/60': variant === 'default',
          'bg-accent/10 text-accent font-semibold': variant === 'accent',
          'bg-glow/10 text-glow': variant === 'secondary',
          'border border-midnight/20 text-midnight/70': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
