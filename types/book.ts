export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  description?: string;
  rating?: number;
  reviews?: number;
  shelf?: string;
  totalPages: number;
  currentPage?: number;
  readingTime?: number;
  genre?: string;
  publishedDate?: string;
  publisher?: string;
  language?: string;
  isbn?: string;
}