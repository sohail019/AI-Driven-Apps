export interface IShelf {
  id: string;
  name: string;
  description?: string;
  libraryId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateShelfRequest {
  name: string;
  description?: string;
  libraryId: string;
  order?: number;
}

export interface IUpdateShelfRequest {
  name?: string;
  description?: string;
  order?: number;
}

export interface IBookInShelf {
  bookId: string;
  shelfId: string;
  status: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
  rating?: number;
  review?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddBookToShelfRequest {
  bookId: string;
  shelfId: string;
  status?: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
}

export interface IUpdateBookInShelfRequest {
  status?: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
  rating?: number;
  review?: string;
  startDate?: Date;
  endDate?: Date;
}
