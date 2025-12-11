'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { HiCheckCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi2'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const icons = {
    success: <HiCheckCircle className="w-6 h-6" />,
    error: <HiXCircle className="w-6 h-6" />,
    info: <HiExclamationCircle className="w-6 h-6" />,
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${colors[type]} text-white px-4 md:px-6 py-3 md:py-4 rounded-lg shadow-lg flex items-center gap-3 text-sm md:text-base`}
    >
      {icons[type]}
      <span>{message}</span>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 space-y-2 md:space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </AnimatePresence>
  )
}
