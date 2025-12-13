// Book Interface
export interface Book {
  id: number
  title: string
  authors: string[]
  translators?: string[]
  editors?: string[]
  reviewers?: string[]
  illustrators?: string[]
  series_editors?: string[]
  contributors?: string[]
  cover_image_url?: string
  epub_isbn?: string | null
  publisher?: string
  subjects: string[]
  language: string
  publication_date?: string | Date | null
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

// Book with Similarity Score
export interface BookWithSimilarity extends Book {
  similarityScore?: number
}

// Extended Filter Options
export interface FilterOptions {
  language?: string
  subject?: string
  publisher?: string
  search?: string
  yearFrom?: number
  yearTo?: number
}

// Stats Interface
export interface Stats {
  total: number
  indonesian: number
  international: number
}

// Dashboard Insights Interface (optional)
export interface DashboardInsights {
  totalBooks: number
  indonesianBooks: number
  internationalBooks: number
  yearRange?: {
    min: number
    max: number
  }
}

// Dataset Insights Interface
export interface DatasetInsights {
  totalBooks?: number
  indonesianBooks?: number
  internationalBooks?: number
  yearRange?: {
    min: number
    max: number
  }
  genreDistribution?: Record<string, number>
  ratingDistribution?: Record<string, number>
  languageDistribution?: Record<string, number>
  vibesFrequency?: Record<string, number>
}
