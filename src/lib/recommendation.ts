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
    // TODO: Fix this method - current Book schema doesn't have genre, vibes, themes, rating, pages fields
    return 0.5 // Default similarity score
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
    // TODO: Fix this method - current Book schema doesn't have vibes/themes/genre fields
    // For now, return empty array until schema is updated
    return []
  }
}
