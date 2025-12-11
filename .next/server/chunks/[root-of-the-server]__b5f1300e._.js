module.exports = [
"[project]/.next-internal/server/app/api/books/[id]/recommendations/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        'query',
        'error',
        'warn'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/recommendationEngine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Advanced Book Recommendation Engine
 * Combines multiple similarity metrics for better recommendations
 */ __turbopack_context__.s([
    "BookRecommendationEngine",
    ()=>BookRecommendationEngine
]);
class BookRecommendationEngine {
    /**
   * Calculate author similarity (0-100)
   * Weighted: exact authors are worth more
   */ static calculateAuthorSimilarity(book1Authors, book2Authors) {
        if (!book1Authors.length || !book2Authors.length) return 0;
        const commonAuthors = book1Authors.filter((a)=>book2Authors.some((a2)=>this.normalizeString(a) === this.normalizeString(a2))).length;
        const maxAuthors = Math.max(book1Authors.length, book2Authors.length);
        return commonAuthors / maxAuthors * 100;
    }
    /**
   * Calculate subject similarity (0-100)
   * Uses Jaccard similarity for set comparison
   */ static calculateSubjectSimilarity(book1Subjects, book2Subjects) {
        if (!book1Subjects.length || !book2Subjects.length) return 0;
        const set1 = new Set(book1Subjects.map((s)=>this.normalizeString(s)));
        const set2 = new Set(book2Subjects.map((s)=>this.normalizeString(s)));
        const intersection = new Set([
            ...set1
        ].filter((x)=>set2.has(x)));
        const union = new Set([
            ...set1,
            ...set2
        ]);
        if (union.size === 0) return 0;
        return intersection.size / union.size * 100;
    }
    /**
   * Calculate language compatibility (0 or 50)
   * Same language gets bonus
   */ static calculateLanguageSimilarity(lang1, lang2) {
        const normalize = (lang)=>lang.toLowerCase().replace(/\s+/g, '');
        return normalize(lang1) === normalize(lang2) ? 50 : 0;
    }
    /**
   * Calculate publisher similarity (0 or 30)
   */ static calculatePublisherSimilarity(pub1, pub2) {
        if (!pub1 || !pub2) return 0;
        return this.normalizeString(pub1) === this.normalizeString(pub2) ? 30 : 0;
    }
    /**
   * Calculate year proximity score (0-40)
   * Books within 5 years get higher scores
   */ static calculateYearSimilarity(date1, date2) {
        if (!date1 || !date2) return 20 // Neutral score
        ;
        const year1 = new Date(date1).getFullYear();
        const year2 = new Date(date2).getFullYear();
        const yearDiff = Math.abs(year1 - year2);
        if (yearDiff === 0) return 40;
        if (yearDiff <= 2) return 35;
        if (yearDiff <= 5) return 25;
        if (yearDiff <= 10) return 15;
        return 0;
    }
    /**
   * Calculate popularity boost (0-50)
   * Based on bookmarks and views
   */ static calculatePopularityBoost(bookmarks, views) {
        let boost = 0;
        if (bookmarks && bookmarks > 0) boost += Math.min(bookmarks * 2, 30);
        if (views && views > 0) boost += Math.min(views * 0.5, 20);
        return Math.min(boost, 50);
    }
    /**
   * Main recommendation scoring function
   * Combines all metrics with weighted average
   */ static calculateRecommendationScore(baseBook, candidateBook) {
        const authorScore = this.calculateAuthorSimilarity(baseBook.authors, candidateBook.authors) * 0.35 // 35% weight
        ;
        const subjectScore = this.calculateSubjectSimilarity(baseBook.subjects, candidateBook.subjects) * 0.35 // 35% weight
        ;
        const languageScore = this.calculateLanguageSimilarity(baseBook.language, candidateBook.language) * 0.1 // 10% weight
        ;
        const publisherScore = this.calculatePublisherSimilarity(baseBook.publisher, candidateBook.publisher) * 0.05 // 5% weight
        ;
        const yearScore = this.calculateYearSimilarity(baseBook.publication_date, candidateBook.publication_date) * 0.08 // 8% weight
        ;
        const popularityScore = this.calculatePopularityBoost(candidateBook.bookmarkCount, candidateBook.viewCount) * 0.07 // 7% weight
        ;
        const totalScore = authorScore + subjectScore + languageScore + publisherScore + yearScore + popularityScore;
        return {
            book: candidateBook,
            score: Math.round(totalScore),
            matchDetails: {
                authorScore: Math.round(authorScore),
                subjectScore: Math.round(subjectScore),
                languageScore: Math.round(languageScore),
                publisherScore: Math.round(publisherScore),
                yearScore: Math.round(yearScore),
                popularityScore: Math.round(popularityScore)
            }
        };
    }
    /**
   * Get top N recommendations for a book
   */ static getRecommendations(baseBook, candidateBooks, topN = 8) {
        const scores = candidateBooks.filter((book)=>book.id !== baseBook.id) // Exclude the book itself
        .map((book)=>this.calculateRecommendationScore(baseBook, book)).filter((rec)=>rec.score > 0) // Only include books with some similarity
        .sort((a, b)=>b.score - a.score).slice(0, topN);
        return scores;
    }
    /**
   * Helper: normalize string for comparison
   */ static normalizeString(str) {
        return str.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    }
}
}),
"[project]/src/app/api/books/[id]/recommendations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$recommendationEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/recommendationEngine.ts [app-route] (ecmascript)");
;
;
;
async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const bookId = parseInt(resolvedParams.id);
        // Get current book
        const book = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].book.findUnique({
            where: {
                id: bookId
            }
        });
        if (!book) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Book not found'
            }, {
                status: 404
            });
        }
        // Find candidate books (similar by basic criteria for efficiency)
        const candidates = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].book.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: bookId
                        }
                    },
                    {
                        OR: [
                            {
                                subjects: {
                                    hasSome: book.subjects
                                }
                            },
                            {
                                authors: {
                                    hasSome: book.authors
                                }
                            },
                            {
                                language: book.language
                            }
                        ]
                    }
                ]
            },
            take: 50,
            orderBy: {
                bookmarkCount: 'desc'
            }
        });
        // Use advanced recommendation engine
        const recommendations = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$recommendationEngine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BookRecommendationEngine"].getRecommendations({
            ...book,
            publisher: book.publisher || undefined
        }, candidates.map((c)=>({
                ...c,
                publisher: c.publisher || undefined
            })), 8);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            recommendations,
            currentBook: book,
            totalCandidates: candidates.length
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to get recommendations'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b5f1300e._.js.map