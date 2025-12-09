import Link from 'next/link'

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Paper
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Pulse
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              📚 Buku
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              📊 Dashboard
            </Link>
            <Link href="/upload" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              ⬆️ Upload
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
