export interface IUserBook {
  id: string;
  userId: string;
  bookId: string;
  libraryId: string;
  shelfId: string;
  status: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
  rating?: number;
  review?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddBookToLibraryRequest {
  bookId: string;
  libraryId: string;
  shelfId: string;
}

export interface IUpdateUserBookRequest {
  status?: "PLANNED" | "READING" | "COMPLETED" | "DROPPED";
  rating?: number;
  review?: string;
  startDate?: Date;
  endDate?: Date;
}
