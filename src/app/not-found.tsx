import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-8xl mb-4">📚</div>
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 text-lg">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="pt-8">
          <Link href="/">
            <Button size="lg">
              ← Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}