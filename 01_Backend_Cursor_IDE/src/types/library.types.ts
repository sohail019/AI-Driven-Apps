export interface ILibrary {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShelf {
  id: string;
  name: string;
  libraryId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBook {
  id: string;
  bookId: string;
  userId: string;
  libraryId: string;
  shelfId: string;
  status: "READING" | "COMPLETED" | "PLANNED";
  createdAt: Date;
  updatedAt: Date;
}

export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLibraryRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface IUpdateLibraryRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface ILibrarySearchParams {
  query?: string;
  userId?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}

export interface ILibrarySearchResponse {
  libraries: ILibrary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
