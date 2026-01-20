const BASE_URL = 'https://books-api.fly.dev';

export interface Book {
  id: number;
  title: string;
  authors: string[];
  translators: string[];
  editors: string[];
  reviewers: string[];
  illustrators: string[];
  series_editors: string[];
  contributors: string[];
  cover_image_url: string;
  epub_isbn: string;
  publisher: string;
  subjects: string[];
  languages: string[];
  publication_date: string;
  description: string;
}

function getValidImageUrl(book: Book): string {
  if (book.cover_image_url && book.cover_image_url.trim() !== '') {
    try {
      new URL(book.cover_image_url);
      return book.cover_image_url;
    } catch {
      // URL tidak valid
    }
  }
  
  const colors = ['4F46E5/ffffff', '7C3AED/ffffff', 'DB2777/ffffff', '2563EB/ffffff', 'DC2626/ffffff', '059669/ffffff'];
  const colorIndex = book.id % colors.length;
  const title = encodeURIComponent(book.title.substring(0, 30));
  return `https://via.placeholder.com/400x600/${colors[colorIndex]}?text=${title}`;
}

function isIndonesianBook(book: Book): boolean {
  return book.languages.some(lang => {
    const langLower = lang.toLowerCase();
    return langLower.includes('indonesia') || 
           langLower.includes('indonesian') || 
           langLower === 'id' || 
           langLower === 'ind';
  });
}

export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${BASE_URL}/books?limit=5000`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allBooks: Book[] = await response.json();
    
    const indonesianBooks: Book[] = [];
    const internationalBooks: Book[] = [];
    
    for (const book of allBooks) {
      book.cover_image_url = getValidImageUrl(book);
      
      if (isIndonesianBook(book)) {
        if (indonesianBooks.length < 500) indonesianBooks.push(book);
      } else if (internationalBooks.length < 500) {
        internationalBooks.push(book);
      }
      
      if (indonesianBooks.length >= 500 && internationalBooks.length >= 500) break;
    }
    
    return [...indonesianBooks, ...internationalBooks];
  } catch (error) {
    console.error('❌ Error fetching books:', error);
    throw error;
  }
}

export async function getBookById(id: number): Promise<Book> {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const book: Book = await response.json();
    book.cover_image_url = getValidImageUrl(book);
    return book;
  } catch (error) {
    console.error(`❌ Error fetching book #${id}:`, error);
    throw error;
  }
}
