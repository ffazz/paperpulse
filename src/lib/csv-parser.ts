import Papa from 'papaparse'
import { Book } from '@/types'

export interface CSVBook {
  title: string
  author: string
  genre: string
  rating: string | number
  vibes: string
  themes: string
  pages: string | number
  year: string | number
  language?: string
}

export class CSVParser {
  static parseVibesOrThemes(value: string): string[] {
    if (!value) return []
    return value
      .split(/[,;|]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }

  static validateBook(row: CSVBook): boolean {
    return !!(
      row.title &&
      row.author &&
      row.genre &&
      row.rating &&
      row.pages &&
      row.year
    )
  }

  static transformBook(row: CSVBook): Omit<Book, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: row.title.trim(),
      author: row.author.trim(),
      genre: row.genre.trim(),
      rating: typeof row.rating === 'string' ? parseFloat(row.rating) : row.rating,
      vibes: this.parseVibesOrThemes(row.vibes),
      themes: this.parseVibesOrThemes(row.themes),
      pages: typeof row.pages === 'string' ? parseInt(row.pages, 10) : row.pages,
      year: typeof row.year === 'string' ? parseInt(row.year, 10) : row.year,
      language: row.language || 'English',
    }
  }

  static async parseCSV(file: File): Promise<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<CSVBook>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const books = results.data
              .filter(this.validateBook)
              .map(this.transformBook)
            resolve(books)
          } catch (error) {
            reject(error)
          }
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  }
}
