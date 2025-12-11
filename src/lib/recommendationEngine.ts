/**
 * Advanced Book Recommendation Engine
 * Combines multiple similarity metrics for better recommendations
 */

interface Book {
  id: number
  title: string
  authors: string[]
  subjects: string[]
  language: string
  publisher?: string
  publication_date?: Date | null
  bookmarkCount?: number
  viewCount?: number
}

interface RecommendationScore {
  book: Book
  score: number
  matchDetails: {
    authorScore: number
    subjectScore: number
    languageScore: number
    publisherScore: number
    yearScore: number
    popularityScore: number
  }
}

export class BookRecommendationEngine {
  /**
   * Calculate author similarity (0-100)
   * Weighted: exact authors are worth more
   */
  static calculateAuthorSimilarity(
    book1Authors: string[],
    book2Authors: string[]
  ): number {
    if (!book1Authors.length || !book2Authors.length) return 0

    const commonAuthors = book1Authors.filter(a =>
      book2Authors.some(a2 => this.normalizeString(a) === this.normalizeString(a2))
    ).length

    const maxAuthors = Math.max(book1Authors.length, book2Authors.length)
    return (commonAuthors / maxAuthors) * 100
  }

  /**
   * Calculate subject similarity (0-100)
   * Uses Jaccard similarity for set comparison
   */
  static calculateSubjectSimilarity(
    book1Subjects: string[],
    book2Subjects: string[]
  ): number {
    if (!book1Subjects.length || !book2Subjects.length) return 0

    const set1 = new Set(book1Subjects.map(s => this.normalizeString(s)))
    const set2 = new Set(book2Subjects.map(s => this.normalizeString(s)))

    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])

    if (union.size === 0) return 0
    return (intersection.size / union.size) * 100
  }

  /**
   * Calculate language compatibility (0 or 50)
   * Same language gets bonus
   */
  static calculateLanguageSimilarity(lang1: string, lang2: string): number {
    const normalize = (lang: string) =>
      lang.toLowerCase().replace(/\s+/g, '')
    return normalize(lang1) === normalize(lang2) ? 50 : 0
  }

  /**
   * Calculate publisher similarity (0 or 30)
   */
  static calculatePublisherSimilarity(pub1?: string, pub2?: string): number {
    if (!pub1 || !pub2) return 0
    return this.normalizeString(pub1) === this.normalizeString(pub2) ? 30 : 0
  }

  /**
   * Calculate year proximity score (0-40)
   * Books within 5 years get higher scores
   */
  static calculateYearSimilarity(date1?: Date | null, date2?: Date | null): number {
    if (!date1 || !date2) return 20 // Neutral score

    const year1 = new Date(date1).getFullYear()
    const year2 = new Date(date2).getFullYear()
    const yearDiff = Math.abs(year1 - year2)

    if (yearDiff === 0) return 40
    if (yearDiff <= 2) return 35
    if (yearDiff <= 5) return 25
    if (yearDiff <= 10) return 15
    return 0
  }

  /**
   * Calculate popularity boost (0-50)
   * Based on bookmarks and views
   */
  static calculatePopularityBoost(
    bookmarks?: number,
    views?: number
  ): number {
    let boost = 0
    if (bookmarks && bookmarks > 0) boost += Math.min(bookmarks * 2, 30)
    if (views && views > 0) boost += Math.min(views * 0.5, 20)
    return Math.min(boost, 50)
  }

  /**
   * Main recommendation scoring function
   * Combines all metrics with weighted average
   */
  static calculateRecommendationScore(
    baseBook: Book,
    candidateBook: Book
  ): RecommendationScore {
    const authorScore = this.calculateAuthorSimilarity(
      baseBook.authors,
      candidateBook.authors
    ) * 0.35 // 35% weight

    const subjectScore = this.calculateSubjectSimilarity(
      baseBook.subjects,
      candidateBook.subjects
    ) * 0.35 // 35% weight

    const languageScore = this.calculateLanguageSimilarity(
      baseBook.language,
      candidateBook.language
    ) * 0.1 // 10% weight

    const publisherScore = this.calculatePublisherSimilarity(
      baseBook.publisher,
      candidateBook.publisher
    ) * 0.05 // 5% weight

    const yearScore = this.calculateYearSimilarity(
      baseBook.publication_date,
      candidateBook.publication_date
    ) * 0.08 // 8% weight

    const popularityScore = this.calculatePopularityBoost(
      candidateBook.bookmarkCount,
      candidateBook.viewCount
    ) * 0.07 // 7% weight

    const totalScore =
      authorScore +
      subjectScore +
      languageScore +
      publisherScore +
      yearScore +
      popularityScore

    return {
      book: candidateBook,
      score: Math.round(totalScore),
      matchDetails: {
        authorScore: Math.round(authorScore),
        subjectScore: Math.round(subjectScore),
        languageScore: Math.round(languageScore),
        publisherScore: Math.round(publisherScore),
        yearScore: Math.round(yearScore),
        popularityScore: Math.round(popularityScore),
      },
    }
  }

  /**
   * Get top N recommendations for a book
   */
  static getRecommendations(
    baseBook: Book,
    candidateBooks: Book[],
    topN: number = 8
  ): RecommendationScore[] {
    const scores = candidateBooks
      .filter(book => book.id !== baseBook.id) // Exclude the book itself
      .map(book => this.calculateRecommendationScore(baseBook, book))
      .filter(rec => rec.score > 0) // Only include books with some similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)

    return scores
  }

  /**
   * Helper: normalize string for comparison
   */
  private static normalizeString(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
  }
}
