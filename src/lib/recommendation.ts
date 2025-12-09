import { Book, BookWithSimilarity } from '@/types'

export class RecommendationEngine {
  private static calculateCosineSimilarity(arr1: string[], arr2: string[]): number {
    const set1 = new Set(arr1.map(s => s.toLowerCase()))
    const set2 = new Set(arr2.map(s => s.toLowerCase()))
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    if (union.size === 0) return 0
    return intersection.size / Math.sqrt(set1.size * set2.size)
  }

  private static calculateGenreMatch(genre1: string, genre2: string): number {
    return genre1.toLowerCase() === genre2.toLowerCase() ? 1 : 0
  }

  private static calculateRatingDistance(rating1: number, rating2: number): number {
    const distance = Math.abs(rating1 - rating2)
    return 1 - (distance / 5)
  }

  private static calculatePagesDistance(pages1: number, pages2: number): number {
    const distance = Math.abs(pages1 - pages2)
    const maxDistance = 800
    return 1 - Math.min(distance / maxDistance, 1)
  }

  public static calculateSimilarity(book1: Book, book2: Book): number {
    const GENRE_WEIGHT = 0.30
    const VIBES_WEIGHT = 0.40
    const THEMES_WEIGHT = 0.20
    const RATING_WEIGHT = 0.05
    const PAGES_WEIGHT = 0.05

    const genreScore = this.calculateGenreMatch(book1.genre, book2.genre)
    const vibesScore = this.calculateCosineSimilarity(book1.vibes, book2.vibes)
    const themesScore = this.calculateCosineSimilarity(book1.themes, book2.themes)
    const ratingScore = this.calculateRatingDistance(book1.rating, book2.rating)
    const pagesScore = this.calculatePagesDistance(book1.pages, book2.pages)

    const totalScore =
      genreScore * GENRE_WEIGHT +
      vibesScore * VIBES_WEIGHT +
      themesScore * THEMES_WEIGHT +
      ratingScore * RATING_WEIGHT +
      pagesScore * PAGES_WEIGHT

    return totalScore
  }

  public static getRecommendations(
    targetBook: Book,
    allBooks: Book[],
    limit: number = 6
  ): BookWithSimilarity[] {
    const booksWithScores = allBooks
      .filter(book => book.id !== targetBook.id)
      .map(book => ({
        ...book,
        similarityScore: this.calculateSimilarity(targetBook, book),
      }))
      .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0))
      .slice(0, limit)

    return booksWithScores
  }

  public static searchByVibes(query: string, books: Book[]): Book[] {
    const queryTerms = query.toLowerCase().split(' ')
    
    return books
      .map(book => {
        const bookVibes = book.vibes.join(' ').toLowerCase()
        const bookThemes = book.themes.join(' ').toLowerCase()
        const bookGenre = book.genre.toLowerCase()
        
        const matchScore = queryTerms.reduce((score, term) => {
          if (bookVibes.includes(term)) score += 3
          if (bookThemes.includes(term)) score += 2
          if (bookGenre.includes(term)) score += 1
          return score
        }, 0)
        
        return { book, matchScore }
      })
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(item => item.book)
  }
}
