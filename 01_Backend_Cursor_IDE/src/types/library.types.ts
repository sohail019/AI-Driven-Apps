export interface ILibrary {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShelf {
  id: string;
  name: string;
  libraryId: string;
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
