import Link from 'next/link'
import { Book } from '@/types'
import { Badge } from './ui/Badge'
import { formatRating } from '@/lib/utils'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="glass rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
        <div className="space-y-3">
          {/* Title & Author */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>

          {/* Rating & Genre */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold text-gray-800">
                {formatRating(book.rating)}
              </span>
            </div>
            <Badge variant="secondary">{book.genre}</Badge>
            <Badge variant="outline">{book.language}</Badge>
          </div>

          {/* Vibes */}
          <div className="flex flex-wrap gap-1">
            {book.vibes.slice(0, 3).map((vibe, idx) => (
              <span
                key={idx}
                className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full"
              >
                {vibe}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span>📄 {book.pages} hal</span>
            <span>📅 {book.year}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
