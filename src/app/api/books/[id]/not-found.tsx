import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function BookNotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-8xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-gray-800">Buku Tidak Ditemukan</h1>
        <p className="text-gray-600 text-lg">
          Buku yang Anda cari tidak ada dalam database kami.
        </p>
        <div className="pt-8 flex gap-4 justify-center">
          <Link href="/books">
            <Button size="lg">
              ← Lihat Semua Buku
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}