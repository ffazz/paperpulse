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
  publisher: string
  subjects: string[]
  language: string
  publication_date?: string | Date | null
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
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
