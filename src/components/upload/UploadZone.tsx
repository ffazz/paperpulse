'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiCloudArrowUp, HiCheckCircle, HiXCircle } from 'react-icons/hi2'
import { Button } from '@/components/ui/Button'

export default function UploadZone() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Please upload a CSV file' })
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Please upload a CSV file' })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `✅ Success! ${data.count} books added` })
        setFile(null)
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${data.error}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setMessage(null)
  }

  return (
    <div className="backdrop-blur-xl bg-white/50 border border-midnight/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300
          ${dragActive 
            ? 'border-accent bg-accent/5 scale-105' 
            : file 
              ? 'border-emerald-500 bg-emerald-50/50' 
              : 'border-midnight/20 hover:border-midnight/40'
          }
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3 sm:space-y-4"
            >
              <HiCheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500 mx-auto" />
              <div>
                <p className="text-base sm:text-lg font-semibold text-midnight break-all">{file.name}</p>
                <p className="text-xs sm:text-sm text-midnight/60 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Remove file
              </button>
            </motion.div>
          ) : (
            <motion.label
              key="no-file"
              htmlFor="file-upload"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="cursor-pointer block space-y-3 sm:space-y-4"
            >
              <motion.div
                animate={{ y: dragActive ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiCloudArrowUp className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto" />
              </motion.div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-midnight mb-1 sm:mb-2">
                  {dragActive ? 'Drop your file here' : 'Drag & drop your CSV file'}
                </p>
                <p className="text-xs sm:text-sm text-midnight/60">
                  or click to browse
                </p>
              </div>
            </motion.label>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
        size="lg"
      >
        {uploading ? 'Uploading...' : 'Upload Dataset'}
      </Button>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              p-3 sm:p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm
              ${message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
              }
            `}
          >
            {message.type === 'success' ? (
              <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            ) : (
              <HiXCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
