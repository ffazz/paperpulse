'use client'

import { useState } from 'react'
import { Button } from './ui/Button'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Silakan pilih file CSV terlebih dahulu')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Berhasil! ${data.count} buku telah ditambahkan.`)
        setFile(null)
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Terjadi kesalahan saat upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="glass rounded-xl p-8 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📤 Upload Dataset Buku
        </h3>
        <p className="text-gray-600">
          Upload file CSV dengan format: title, author, genre, rating, vibes, themes, pages, year, language
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex flex-col items-center"
          >
            <div className="text-6xl mb-4">📁</div>
            <span className="text-lg font-medium text-gray-700">
              {file ? file.name : 'Klik untuk memilih file CSV'}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              atau drag and drop file di sini
            </span>
          </label>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? 'Mengupload...' : 'Upload Dataset'}
        </Button>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Format CSV:</h4>
        <pre className="text-xs text-blue-800 overflow-x-auto">
{`title,author,genre,rating,vibes,themes,pages,year,language
"Book Title","Author Name","Fiction",4.5,"romantic;nostalgic","love;memory",350,2024,"English"`}
        </pre>
      </div>
    </div>
  )
}
