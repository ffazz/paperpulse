import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-block">
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Paper
            </span>
            <span className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent pulse-animation">
              Pulse
            </span>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            Temukan Bacaan Berikutnya Yang Sempurna
          </p>
        </div>

        {/* Description */}
        <div className="glass rounded-3xl p-8 md:p-12 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Jelajahi koleksi buku Indonesia dan Internasional terpopuler 2020-2025. 
            Sistem rekomendasi cerdas kami memahami vibes yang Anda cari.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="text-4xl">📖</div>
              <h3 className="font-semibold text-gray-800">Smart Matching</h3>
              <p className="text-sm text-gray-600">AI similarity algorithm</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">✨</div>
              <h3 className="font-semibold text-gray-800">Vibe Search</h3>
              <p className="text-sm text-gray-600">Cari berdasarkan mood</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🌏</div>
              <h3 className="font-semibold text-gray-800">Indo + Internasional</h3>
              <p className="text-sm text-gray-600">Buku dari berbagai bahasa</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link href="/books">
            <Button size="lg" className="w-full sm:w-auto">
              🚀 Jelajahi Buku
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              📊 Lihat Dashboard
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              ⬆️ Upload Dataset
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-2 gap-6 text-left">
          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">🎨 Desain Modern</h3>
            <p className="text-gray-600 text-sm">
              Interface yang indah dan nyaman untuk para pencinta buku.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">🔍 Filter Canggih</h3>
            <p className="text-gray-600 text-sm">
              Cari berdasarkan genre, vibes, tema, rating, bahasa, dan tahun terbit.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">📈 Visual Analytics</h3>
            <p className="text-gray-600 text-sm">
              Grafik interaktif untuk distribusi genre, trend rating, dan statistik lainnya.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">🤖 AI Recommendation</h3>
            <p className="text-gray-600 text-sm">
              Algoritma hybrid similarity untuk rekomendasi yang akurat dan personal.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-600">48+</div>
            <div className="text-sm text-gray-600">Total Buku</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-3xl font-bold text-teal-600">18</div>
            <div className="text-sm text-gray-600">Buku Indonesia</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-3xl font-bold text-cyan-600">30</div>
            <div className="text-sm text-gray-600">Buku Internasional</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-600">2020-2025</div>
            <div className="text-sm text-gray-600">Periode</div>
          </div>
        </div>
      </div>
    </div>
  )
}
