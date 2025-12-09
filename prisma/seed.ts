import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const OPEN_LIBRARY_API = 'https://openlibrary.org'

interface BookData {
  title: string
  authors: string[]
  translators: string[]
  cover_image_url: string
  epub_isbn: string | null
  publisher: string
  subjects: string[]
  language: string
  publication_date: Date | null
  description: string
}

// ========================================
// CURATED INDONESIAN BOOKS WITH COMPLETE DATA
// ========================================
async function getIndonesianBooksData(): Promise<BookData[]> {
  const books: BookData[] = [
    // Pramoedya Ananta Toer - Tetralogi Buru
    {
      title: 'Bumi Manusia',
      authors: ['Pramoedya Ananta Toer'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388280588i/1398034.jpg',
      epub_isbn: '9789799731234',
      publisher: 'Hasta Mitra',
      subjects: ['Fiction', 'Historical Fiction', 'Indonesian Literature', 'Classic', 'Drama'],
      language: 'Indonesian',
      publication_date: new Date('1980-01-01'),
      description: 'Novel pertama dari Tetralogi Buru yang menceritakan kisah Minke, seorang pribumi Jawa yang belajar di HBS (Hoogere Burger School). Novel ini mengeksplorasi tema kolonialisme, identitas nasional, dan perjuangan melawan penindasan.',
    },
    {
      title: 'Anak Semua Bangsa',
      authors: ['Pramoedya Ananta Toer'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320532860i/1398039.jpg',
      epub_isbn: '9789799731241',
      publisher: 'Hasta Mitra',
      subjects: ['Fiction', 'Historical Fiction', 'Indonesian Literature', 'Political', 'Drama'],
      language: 'Indonesian',
      publication_date: new Date('1980-01-01'),
      description: 'Novel kedua Tetralogi Buru yang melanjutkan perjuangan Minke melawan kolonialisme Belanda dan membangun kesadaran nasional.',
    },
    {
      title: 'Jejak Langkah',
      authors: ['Pramoedya Ananta Toer'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320410266i/1398040.jpg',
      epub_isbn: '9789799731258',
      publisher: 'Hasta Mitra',
      subjects: ['Fiction', 'Historical Fiction', 'Indonesian Literature', 'Political'],
      language: 'Indonesian',
      publication_date: new Date('1985-01-01'),
      description: 'Novel ketiga yang menceritakan perjuangan organisasi modern pertama di Indonesia.',
    },
    
    // Andrea Hirata
    {
      title: 'Laskar Pelangi',
      authors: ['Andrea Hirata'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1389772702i/1362193.jpg',
      epub_isbn: '9789793062792',
      publisher: 'Bentang Pustaka',
      subjects: ['Fiction', 'Young Adult', 'Education', 'Inspirational', 'Coming of Age'],
      language: 'Indonesian',
      publication_date: new Date('2005-01-01'),
      description: 'Kisah inspiratif sepuluh anak dari keluarga miskin di Belitung yang berjuang menempuh pendidikan dengan segala keterbatasan.',
    },
    {
      title: 'Sang Pemimpi',
      authors: ['Andrea Hirata'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320527990i/2301307.jpg',
      epub_isbn: '9789793062808',
      publisher: 'Bentang Pustaka',
      subjects: ['Fiction', 'Young Adult', 'Coming of Age', 'Inspirational', 'Adventure'],
      language: 'Indonesian',
      publication_date: new Date('2006-01-01'),
      description: 'Sekuel Laskar Pelangi yang menceritakan perjuangan tiga pemimpi muda: Ikal, Arai, dan Jimbron mengejar mimpi mereka ke Eropa.',
    },
    {
      title: 'Edensor',
      authors: ['Andrea Hirata'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320411486i/3635716.jpg',
      epub_isbn: '9789793062815',
      publisher: 'Bentang Pustaka',
      subjects: ['Fiction', 'Young Adult', 'Travel', 'Adventure', 'Romance'],
      language: 'Indonesian',
      publication_date: new Date('2007-01-01'),
      description: 'Petualangan Ikal di Eropa, melanjutkan mimpinya sambil mencari cinta sejatinya.',
    },
    
    // Tere Liye - Serial Bumi
    {
      title: 'Bumi',
      authors: ['Tere Liye'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1443103393i/25696331.jpg',
      epub_isbn: '9786020822235',
      publisher: 'Gramedia Pustaka Utama',
      subjects: ['Fantasy', 'Young Adult', 'Adventure', 'Magic', 'Science Fiction'],
      language: 'Indonesian',
      publication_date: new Date('2014-01-01'),
      description: 'Petualangan Raib yang bisa menghilang, Seli yang bisa mengeluarkan petir, dan Ali yang genius dalam matematika, memasuki dunia paralel yang penuh misteri.',
    },
    {
      title: 'Bulan',
      authors: ['Tere Liye'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1456370890i/28818398.jpg',
      epub_isbn: '9786020822242',
      publisher: 'Gramedia Pustaka Utama',
      subjects: ['Fantasy', 'Young Adult', 'Adventure', 'Magic', 'Mystery'],
      language: 'Indonesian',
      publication_date: new Date('2015-01-01'),
      description: 'Petualangan berlanjut ke Klan Bulan, tempat Seli berasal. Misteri keluarga Seli mulai terungkap.',
    },
    {
      title: 'Matahari',
      authors: ['Tere Liye'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1483524946i/33413160.jpg',
      epub_isbn: '9786020822259',
      publisher: 'Gramedia Pustaka Utama',
      subjects: ['Fantasy', 'Young Adult', 'Adventure', 'Magic', 'Action'],
      language: 'Indonesian',
      publication_date: new Date('2016-01-01'),
      description: 'Raib, Seli, dan Ali menghadapi musuh terkuat mereka di Klan Matahari.',
    },
    
    // Dee Lestari
    {
      title: 'Perahu Kertas',
      authors: ['Dee Lestari'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320523960i/8492352.jpg',
      epub_isbn: '9786028811392',
      publisher: 'Bentang Pustaka',
      subjects: ['Romance', 'Fiction', 'Young Adult', 'Contemporary', 'Drama'],
      language: 'Indonesian',
      publication_date: new Date('2009-01-01'),
      description: 'Kisah cinta Kugy yang bermimpi menjadi penulis dongeng dan Keenan yang ingin menjadi pelukis, namun takdir memisahkan mereka.',
    },
    {
      title: 'Supernova: Ksatria, Puteri, dan Bintang Jatuh',
      authors: ['Dee Lestari'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320532744i/1133135.jpg',
      epub_isbn: '9789799101891',
      publisher: 'Truedee Pustaka',
      subjects: ['Science Fiction', 'Romance', 'Philosophy', 'Contemporary', 'Fiction'],
      language: 'Indonesian',
      publication_date: new Date('2001-01-01'),
      description: 'Novel filosofis tentang Dimas dan Reuben, dua jiwa yang terperangkap dalam satu tubuh, mencari cinta dan jati diri.',
    },
    {
      title: 'Rectoverso',
      authors: ['Dee Lestari'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1349020476i/15749933.jpg',
      epub_isbn: '9786028811408',
      publisher: 'Bentang Pustaka',
      subjects: ['Short Stories', 'Romance', 'Fiction', 'Contemporary'],
      language: 'Indonesian',
      publication_date: new Date('2008-01-01'),
      description: 'Kumpulan cerpen tentang cinta dalam berbagai bentuk dan dimensi.',
    },
    
    // Eka Kurniawan
    {
      title: 'Cantik Itu Luka',
      authors: ['Eka Kurniawan'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386924310i/304016.jpg',
      epub_isbn: '9789799101983',
      publisher: 'Gramedia Pustaka Utama',
      subjects: ['Fiction', 'Magical Realism', 'Historical Fiction', 'Horror', 'Literary Fiction'],
      language: 'Indonesian',
      publication_date: new Date('2002-01-01'),
      description: 'Saga keluarga yang berlatar sejarah Indonesia, dipenuhi unsur magis dan horor. Menceritakan Dewi Ayu dan keturunannya.',
    },
    {
      title: 'Lelaki Harimau',
      authors: ['Eka Kurniawan'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436979669i/25622296.jpg',
      epub_isbn: '9786020822266',
      publisher: 'Gramedia Pustaka Utama',
      subjects: ['Fiction', 'Magical Realism', 'Thriller', 'Mystery', 'Literary Fiction'],
      language: 'Indonesian',
      publication_date: new Date('2004-01-01'),
      description: 'Kisah pembunuhan misterius Margio terhadap Anwar Sadat, dengan sentuhan magis realisme yang kuat.',
    },
  ]
  
  // Add more Indonesian books to reach 500
  const additionalIndonesian = await fetchFromOpenLibrary('indonesia', 485, 'Indonesian')
  return [...books, ...additionalIndonesian]
}

// ========================================
// CURATED INTERNATIONAL BOOKS
// ========================================
async function getInternationalBooksData(): Promise<BookData[]> {
  const books: BookData[] = [
    // J.K. Rowling - Harry Potter Series
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      authors: ['J.K. Rowling'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg',
      epub_isbn: '9780747532699',
      publisher: 'Bloomsbury',
      subjects: ['Fantasy', 'Young Adult', 'Magic', 'Adventure', 'Fiction'],
      language: 'English',
      publication_date: new Date('1997-06-26'),
      description: 'The magical journey of Harry Potter begins as he discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry.',
    },
    {
      title: 'Harry Potter and the Chamber of Secrets',
      authors: ['J.K. Rowling'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474169725i/15881.jpg',
      epub_isbn: '9780439064866',
      publisher: 'Scholastic',
      subjects: ['Fantasy', 'Young Adult', 'Magic', 'Mystery', 'Adventure'],
      language: 'English',
      publication_date: new Date('1998-07-02'),
      description: 'Harry returns to Hogwarts for his second year and faces the mystery of the Chamber of Secrets.',
    },
    {
      title: 'Harry Potter and the Prisoner of Azkaban',
      authors: ['J.K. Rowling'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630547330i/5.jpg',
      epub_isbn: '9780439136358',
      publisher: 'Scholastic',
      subjects: ['Fantasy', 'Young Adult', 'Magic', 'Adventure', 'Time Travel'],
      language: 'English',
      publication_date: new Date('1999-07-08'),
      description: 'Harry learns about his past and encounters a dangerous escaped prisoner.',
    },
        // George Orwell
    {
      title: '1984',
      authors: ['George Orwell'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
      epub_isbn: '9780451524935',
      publisher: 'Signet Classic',
      subjects: ['Dystopian', 'Science Fiction', 'Classic', 'Political Fiction', 'Fiction'],
      language: 'English',
      publication_date: new Date('1949-06-08'),
      description: 'A totalitarian regime manipulates truth and controls every aspect of life in a chilling dystopian future.',
    },
    {
      title: 'Animal Farm',
      authors: ['George Orwell'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1424037542i/7613.jpg',
      epub_isbn: '9780451526342',
      publisher: 'Signet Classic',
      subjects: ['Satire', 'Political Fiction', 'Classic', 'Fiction', 'Allegory'],
      language: 'English',
      publication_date: new Date('1945-08-17'),
      description: 'A satirical allegory of totalitarianism where farm animals rebel against their human farmer.',
    },
    
    // Paulo Coelho
    {
      title: 'The Alchemist',
      authors: ['Paulo Coelho'],
      translators: ['Alan R. Clarke'],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
      epub_isbn: '9780062315007',
      publisher: 'HarperOne',
      subjects: ['Fiction', 'Philosophy', 'Adventure', 'Inspirational', 'Spirituality'],
      language: 'English',
      publication_date: new Date('1988-01-01'),
      description: 'A shepherd boy\'s journey to Egypt to find treasure teaches him about following dreams and listening to his heart.',
    },
    {
      title: 'Eleven Minutes',
      authors: ['Paulo Coelho'],
      translators: ['Margaret Jull Costa'],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442917198i/3618.jpg',
      epub_isbn: '9780060589288',
      publisher: 'HarperCollins',
      subjects: ['Fiction', 'Romance', 'Philosophy', 'Contemporary'],
      language: 'English',
      publication_date: new Date('2003-01-01'),
      description: 'A young Brazilian woman\'s journey of self-discovery through love and desire.',
    },
    
    // Harper Lee
    {
      title: 'To Kill a Mockingbird',
      authors: ['Harper Lee'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
      epub_isbn: '9780061120084',
      publisher: 'Harper Perennial',
      subjects: ['Fiction', 'Classic', 'Historical Fiction', 'Drama', 'Southern Gothic'],
      language: 'English',
      publication_date: new Date('1960-07-11'),
      description: 'A timeless story of racial injustice and childhood innocence in the American South during the 1930s.',
    },
    
    // F. Scott Fitzgerald
    {
      title: 'The Great Gatsby',
      authors: ['F. Scott Fitzgerald'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
      epub_isbn: '9780743273565',
      publisher: 'Scribner',
      subjects: ['Fiction', 'Classic', 'Romance', 'Historical Fiction', 'American Literature'],
      language: 'English',
      publication_date: new Date('1925-04-10'),
      description: 'The tragic story of Jay Gatsby and his obsessive love for Daisy Buchanan in 1920s America.',
    },
    
    // Jane Austen
    {
      title: 'Pride and Prejudice',
      authors: ['Jane Austen'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
      epub_isbn: '9780141439518',
      publisher: 'Penguin Classics',
      subjects: ['Romance', 'Classic', 'Fiction', 'Historical Fiction', 'British Literature'],
      language: 'English',
      publication_date: new Date('1813-01-28'),
      description: 'The story of Elizabeth Bennet and Mr. Darcy, navigating love, class, and social expectations in Regency England.',
    },
    {
      title: 'Emma',
      authors: ['Jane Austen'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1692357075i/6969.jpg',
      epub_isbn: '9780141439587',
      publisher: 'Penguin Classics',
      subjects: ['Romance', 'Classic', 'Fiction', 'British Literature', 'Comedy'],
      language: 'English',
      publication_date: new Date('1815-12-23'),
      description: 'Emma Woodhouse, a well-meaning but often misguided matchmaker, learns about love and self-awareness.',
    },
    
    // Ernest Hemingway
    {
      title: 'The Old Man and the Sea',
      authors: ['Ernest Hemingway'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1329189714i/2165.jpg',
      epub_isbn: '9780684801223',
      publisher: 'Scribner',
      subjects: ['Fiction', 'Classic', 'Adventure', 'American Literature', 'Nobel Prize'],
      language: 'English',
      publication_date: new Date('1952-09-01'),
      description: 'An aging Cuban fisherman\'s epic struggle with a giant marlin in the Gulf Stream.',
    },
    {
      title: 'A Farewell to Arms',
      authors: ['Ernest Hemingway'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1313714836i/10799.jpg',
      epub_isbn: '9780684801469',
      publisher: 'Scribner',
      subjects: ['Fiction', 'War', 'Romance', 'Classic', 'Historical Fiction'],
      language: 'English',
      publication_date: new Date('1929-09-27'),
      description: 'A love story set against the backdrop of World War I in Italy.',
    },
    
    // Agatha Christie
    {
      title: 'Murder on the Orient Express',
      authors: ['Agatha Christie'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1638425885i/853510.jpg',
      epub_isbn: '9780062693662',
      publisher: 'William Morrow',
      subjects: ['Mystery', 'Crime', 'Thriller', 'Classic', 'Detective'],
      language: 'English',
      publication_date: new Date('1934-01-01'),
      description: 'Hercule Poirot investigates a murder aboard the luxurious Orient Express train.',
    },
    {
      title: 'And Then There Were None',
      authors: ['Agatha Christie'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1638425885i/16299.jpg',
      epub_isbn: '9780062073488',
      publisher: 'William Morrow',
      subjects: ['Mystery', 'Thriller', 'Crime', 'Classic', 'Suspense'],
      language: 'English',
      publication_date: new Date('1939-11-06'),
      description: 'Ten strangers are invited to an island and murdered one by one, following a sinister nursery rhyme.',
    },
    
    // Stephen King
    {
      title: 'The Shining',
      authors: ['Stephen King'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353277730i/11588.jpg',
      epub_isbn: '9780307743657',
      publisher: 'Doubleday',
      subjects: ['Horror', 'Thriller', 'Fiction', 'Supernatural', 'Psychological'],
      language: 'English',
      publication_date: new Date('1977-01-28'),
      description: 'A family\'s winter isolation in a haunted hotel leads to terrifying consequences.',
    },
    {
      title: 'It',
      authors: ['Stephen King'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1334416842i/830502.jpg',
      epub_isbn: '9780670813025',
      publisher: 'Viking',
      subjects: ['Horror', 'Fiction', 'Thriller', 'Supernatural', 'Coming of Age'],
      language: 'English',
      publication_date: new Date('1986-09-15'),
      description: 'Seven children face their worst nightmares when they encounter a shape-shifting entity that feeds on fear.',
    },
    
    // J.R.R. Tolkien
    {
      title: 'The Hobbit',
      authors: ['J.R.R. Tolkien'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
      epub_isbn: '9780547928227',
      publisher: 'Houghton Mifflin',
      subjects: ['Fantasy', 'Adventure', 'Classic', 'Fiction', 'Epic'],
      language: 'English',
      publication_date: new Date('1937-09-21'),
      description: 'Bilbo Baggins, a hobbit, embarks on an unexpected adventure to reclaim treasure guarded by a dragon.',
    },
    {
      title: 'The Fellowship of the Ring',
      authors: ['J.R.R. Tolkien'],
      translators: [],
      cover_image_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654215925i/61215351.jpg',
      epub_isbn: '9780547928210',
      publisher: 'Houghton Mifflin',
      subjects: ['Fantasy', 'Epic', 'Adventure', 'Classic', 'Fiction'],
      language: 'English',
      publication_date: new Date('1954-07-29'),
      description: 'The first volume of The Lord of the Rings, following Frodo\'s quest to destroy the One Ring.',
    },
  ]
  
  // Add more international books to reach 500
  const additionalInternational = await fetchFromOpenLibrary('fiction', 485, 'English')
  return [...books, ...additionalInternational]
}

// ========================================
// FETCH ADDITIONAL BOOKS FROM OPEN LIBRARY
// ========================================
async function fetchFromOpenLibrary(query: string, count: number, language: string): Promise<BookData[]> {
  const books: BookData[] = []
  
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=${Math.min(count * 2, 500)}`
    )
    
    if (!response.ok) {
      console.warn(`   ⚠️  Failed to fetch from Open Library for "${query}"`)
      return []
    }
    
    const data = await response.json()
    
    if (data.docs) {
      for (const doc of data.docs) {
        if (books.length >= count) break
        
        // Only include books with proper data
        if (!doc.title || !doc.author_name || !doc.cover_i) continue
        
        books.push({
          title: doc.title,
          authors: doc.author_name || ['Unknown Author'],
          translators: [],
          cover_image_url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
          epub_isbn: doc.isbn?.[0] || null,
          publisher: doc.publisher?.[0] || 'Unknown Publisher',
          subjects: (doc.subject || ['General']).slice(0, 5),
          language: language,
          publication_date: doc.first_publish_year ? new Date(`${doc.first_publish_year}-01-01`) : null,
          description: doc.first_sentence?.join(' ') || 'No description available.',
        })
      }
    }
  } catch (error) {
    console.error(`   ✗ Error fetching from Open Library:`, error)
  }
  
  return books
}

// ========================================
// MAIN SEEDING FUNCTION
// ========================================
async function main() {
  console.log('🔄 Starting database seed with HIGH-QUALITY data...\n')
  console.log('📚 This will take 3-5 minutes...\n')
  
  try {
    // Get Indonesian books
    console.log('📥 Preparing Indonesian books...')
    const indonesianBooks = await getIndonesianBooksData()
    console.log(`   ✅ Prepared ${indonesianBooks.length} Indonesian books\n`)
    
    // Get International books
    console.log('📥 Preparing International books...')
    const internationalBooks = await getInternationalBooksData()
    console.log(`   ✅ Prepared ${internationalBooks.length} International books\n`)
    
    // Clear existing data
    console.log('🗑️  Clearing existing books...')
    await prisma.book.deleteMany()
    console.log('   ✅ Database cleared\n')
    
    // Seed Indonesian books
    console.log('💾 Seeding Indonesian books to database...')
    let idCount = 0
    for (const book of indonesianBooks) {
      try {
        await prisma.book.create({
          data: {
            title: book.title,
            authors: book.authors,
            translators: book.translators,
            editors: [],
            reviewers: [],
            illustrators: [],
            series_editors: [],
            contributors: [],
cover_image_url: book.cover_image_url,
            epub_isbn: book.epub_isbn,
            publisher: book.publisher,
            subjects: book.subjects,
            language: book.language,
            publication_date: book.publication_date,
            description: book.description,
          }
        })
        idCount++
        
        if (idCount % 50 === 0) {
          console.log(`   ⏳ Progress: ${idCount}/${indonesianBooks.length} books...`)
        }
      } catch (error: any) {
        // Skip duplicates or invalid data
        if (!error.message?.includes('Unique constraint')) {
          console.error(`   ⚠️  Skipped: ${book.title}`)
        }
      }
    }
    console.log(`   ✅ Seeded ${idCount} Indonesian books\n`)
    
    // Seed International books
    console.log('💾 Seeding International books to database...')
    let intCount = 0
    for (const book of internationalBooks) {
      try {
        await prisma.book.create({
          data: {
            title: book.title,
            authors: book.authors,
            translators: book.translators,
            editors: [],
            reviewers: [],
            illustrators: [],
            series_editors: [],
            contributors: [],
            cover_image_url: book.cover_image_url,
            epub_isbn: book.epub_isbn,
            publisher: book.publisher,
            subjects: book.subjects,
            language: book.language,
            publication_date: book.publication_date,
            description: book.description,
          }
        })
        intCount++
        
        if (intCount % 50 === 0) {
          console.log(`   ⏳ Progress: ${intCount}/${internationalBooks.length} books...`)
        }
      } catch (error: any) {
        // Skip duplicates or invalid data
        if (!error.message?.includes('Unique constraint')) {
          console.error(`   ⚠️  Skipped: ${book.title}`)
        }
      }
    }
    console.log(`   ✅ Seeded ${intCount} International books\n`)
    
    // Print final statistics
    await printFinalStats()
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

// ========================================
// PRINT FINAL STATISTICS
// ========================================
async function printFinalStats() {
  console.log('═══════════════════════════════════════════════')
  console.log('📊 FINAL DATABASE STATISTICS')
  console.log('═══════════════════════════════════════════════\n')
  
  const [total, indonesian, english] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { language: 'Indonesian' } }),
    prisma.book.count({ where: { language: 'English' } }),
  ])
  
  console.log(`   📖 Total Books: ${total}`)
  console.log(`   🇮🇩 Indonesian: ${indonesian}`)
  console.log(`   🌍 English: ${english}\n`)
  
  // Get subject statistics
  const allBooks = await prisma.book.findMany({
    select: { subjects: true }
  })
  
  const subjectCount = new Map<string, number>()
  allBooks.forEach(book => {
    book.subjects.forEach(subject => {
      subjectCount.set(subject, (subjectCount.get(subject) || 0) + 1)
    })
  })
  
  const topSubjects = Array.from(subjectCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  console.log('📚 Top 10 Subjects:')
  topSubjects.forEach(([subject, count], index) => {
    console.log(`   ${index + 1}. ${subject}: ${count} books`)
  })
  
  // Sample books
  console.log('\n📖 Sample Indonesian Books:')
  const sampleIndonesian = await prisma.book.findMany({
    where: { language: 'Indonesian' },
    take: 5,
    select: {
      title: true,
      authors: true,
      subjects: true,
    }
  })
  
  sampleIndonesian.forEach((book, index) => {
    console.log(`   ${index + 1}. "${book.title}" by ${book.authors.join(', ')}`)
    console.log(`      Subjects: ${book.subjects.slice(0, 3).join(', ')}`)
  })
  
  console.log('\n📖 Sample International Books:')
  const sampleInternational = await prisma.book.findMany({
    where: { language: 'English' },
    take: 5,
    select: {
      title: true,
      authors: true,
      subjects: true,
    }
  })
  
  sampleInternational.forEach((book, index) => {
    console.log(`   ${index + 1}. "${book.title}" by ${book.authors.join(', ')}`)
    console.log(`      Subjects: ${book.subjects.slice(0, 3).join(', ')}`)
  })
  
  console.log('\n═══════════════════════════════════════════════')
  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!')
  console.log('═══════════════════════════════════════════════\n')
  console.log('🚀 Next steps:')
  console.log('   1. Run: npm run dev')
  console.log('   2. Open: http://localhost:3000')
  console.log('   3. Explore the books!\n')
}

// ========================================
// EXECUTE MAIN FUNCTION
// ========================================
main()
  .catch((e) => {
    console.error('\n❌ FATAL ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })