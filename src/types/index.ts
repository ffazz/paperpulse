export interface Book {
  id: string
  title: string
  author: string
  genre: string
  rating: number
  vibes: string[]
  themes: string[]
  pages: number
  year: number
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface BookWithSimilarity extends Book {
  similarityScore?: number
}

export interface FilterOptions {
  search?: string
  genre?: string
  vibes?: string[]
  themes?: string[]
  language?: string
  minRating?: number
  maxRating?: number
  minPages?: number
  maxPages?: number
  minYear?: number
  maxYear?: number
  sortBy?: 'rating' | 'pages' | 'year' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface DatasetInsights {
  totalBooks: number
  averageRating: number
  averagePages: number
  genreDistribution: Record<string, number>
  vibesFrequency: Record<string, number>
  themesFrequency: Record<string, number>
  languageDistribution: Record<string, number>
  yearRange: { min: number; max: number }
  ratingDistribution: Record<string, number>
}
