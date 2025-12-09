import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { formatRating } from '@/lib/utils'
import RecommendationPanel from '@/components/RecommendationPanel'

export default async function BookDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  })

  if (!book) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Book Detail */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover Placeholder */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
              <div className="text-6xl">📖</div>
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600">oleh {book.author}</p>
            </div>

            {/* Rating & Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="text-2xl font-bold text-gray-800">
                  {formatRating(book.rating)}
                </span>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {book.genre}
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                {book.language === 'Indonesian' ? '🇮🇩 Indonesia' : '🌍 English'}
              </Badge>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Halaman:</span> {book.pages}
              </div>
              <div>
                <span className="font-semibold">Tahun:</span> {book.year}
              </div>
            </div>

            {/* Vibes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">✨ Vibes</h3>
              <div className="flex flex-wrap gap-2">
                {book.vibes.map((vibe, idx) => (
                  <span
                    key={idx}
                    className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🎭 Tema</h3>
              <div className="flex flex-wrap gap-2">
                {book.themes.map((theme, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationPanel bookId={book.id} />
    </div>
  )
}