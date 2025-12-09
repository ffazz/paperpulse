import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        {
          'bg-blue-100 text-blue-700': variant === 'default',
          'bg-teal-100 text-teal-700': variant === 'secondary',
          'border border-blue-300 text-blue-700': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
