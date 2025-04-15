export interface IBook {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  isbn?: string;
  coverImage?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  categories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBookRequest {
  title: string;
  authors: string[];
  description?: string;
  isbn?: string;
  coverImage?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  categories?: string[];
}

export interface IUpdateBookRequest {
  title?: string;
  authors?: string[];
  description?: string;
  isbn?: string;
  coverImage?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  categories?: string[];
}

export interface IBookSearchParams {
  query?: string;
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface IBookSearchResponse {
  books: IBook[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBookInLibrary {
  bookId: string;
  libraryId: string;
  status: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
  rating?: number;
  review?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
