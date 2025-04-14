import { Book } from "../models/Book";
import { UserBook } from "../models/UserBook";
import { AppError } from "../utils/AppError";
import { IBook, IUserBook } from "../types/library.types";
import {
  GoogleBooksResponse,
  GoogleBooksVolume,
} from "../types/googleBooks.types";
import axios from "axios";

class BookService {
  private async searchGoogleBooks(params: {
    isbn?: string;
    title?: string;
    author?: string;
  }): Promise<GoogleBooksVolume | null> {
    const { isbn, title, author } = params;
    const query = [
      isbn ? `isbn:${isbn}` : "",
      title ? `intitle:${title}` : "",
      author ? `inauthor:${author}` : "",
    ]
      .filter(Boolean)
      .join("+");

    try {
      const response = await axios.get<GoogleBooksResponse>(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_API_KEY}`
      );

      if (response.data.totalItems === 0) {
        return null;
      }

      return response.data.items[0];
    } catch (error) {
      console.error("Google Books API error:", error);
      throw new AppError("Failed to fetch book from Google Books API", 500);
    }
  }

  async createBook(
    bookData: Omit<IBook, "id" | "createdAt" | "updatedAt">
  ): Promise<IBook> {
    const book = await Book.create(bookData);
    return book;
  }

  async createBookFromISBN(isbn: string): Promise<IBook> {
    // Check if book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return existingBook;
    }

    const googleBook = await this.searchGoogleBooks({ isbn });
    if (!googleBook) {
      throw new AppError("Book not found with provided ISBN", 404);
    }

    const bookData = googleBook.volumeInfo;
    const isbn13 = bookData.industryIdentifiers?.find(
      (id) => id.type === "ISBN_13"
    )?.identifier;

    // Create book from Google Books data
    const book = await Book.create({
      title: bookData.title,
      author: bookData.authors?.join(", ") || "Unknown",
      isbn: isbn13 || isbn,
      description: bookData.description || "",
      coverImage: bookData.imageLinks?.thumbnail,
      publishedDate: bookData.publishedDate,
      publisher: bookData.publisher,
      pageCount: bookData.pageCount,
      categories: bookData.categories,
      language: bookData.language,
    });

    return book;
  }

  async getBookById(id: string): Promise<IBook> {
    const book = await Book.findOne({ id });
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    return book;
  }

  async searchBooks(query: string): Promise<IBook[]> {
    const googleBook = await this.searchGoogleBooks({ title: query });
    if (!googleBook) {
      return [];
    }

    const bookData = googleBook.volumeInfo;
    const isbn13 = bookData.industryIdentifiers?.find(
      (id) => id.type === "ISBN_13"
    )?.identifier;

    // Check if book exists in database
    let book = await Book.findOne({ isbn: isbn13 });
    if (!book) {
      // Create new book if not found
      book = await Book.create({
        title: bookData.title,
        author: bookData.authors?.join(", ") || "Unknown",
        isbn: isbn13 || "",
        description: bookData.description || "",
        coverImage: bookData.imageLinks?.thumbnail,
        publishedDate: bookData.publishedDate,
        publisher: bookData.publisher,
        pageCount: bookData.pageCount,
        categories: bookData.categories,
        language: bookData.language,
      });
    }

    return [book];
  }

  async updateBook(id: string, bookData: Partial<IBook>): Promise<IBook> {
    const book = await Book.findOneAndUpdate(
      { id },
      { ...bookData, updatedAt: new Date() },
      { new: true }
    );
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    return book;
  }

  async deleteBook(id: string): Promise<void> {
    const book = await Book.findOneAndDelete({ id });
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    // Delete all user book entries for this book
    await UserBook.deleteMany({ bookId: id });
  }

  // User Book Management
  async addBookToLibrary(
    userBookData: Omit<IUserBook, "id" | "createdAt" | "updatedAt">
  ): Promise<IUserBook> {
    const { bookId, userId, libraryId, shelfId } = userBookData;

    // Check if book exists
    await this.getBookById(bookId);

    // Check if book is already in the library
    const existingUserBook = await UserBook.findOne({
      bookId,
      userId,
      libraryId,
    });
    if (existingUserBook) {
      throw new AppError("Book already exists in library", 400);
    }

    const userBook = await UserBook.create(userBookData);
    return userBook as unknown as IUserBook;
  }

  async getUserBooks(
    userId: string,
    libraryId?: string,
    shelfId?: string
  ): Promise<IUserBook[]> {
    const query: any = { userId };
    if (libraryId) query.libraryId = libraryId;
    if (shelfId) query.shelfId = shelfId;

    return (await UserBook.find(query).populate(
      "bookId"
    )) as unknown as IUserBook[];
  }

  async updateUserBookStatus(
    id: string,
    status: IUserBook["status"]
  ): Promise<IUserBook> {
    const userBook = await UserBook.findOneAndUpdate(
      { id },
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!userBook) {
      throw new AppError("User book entry not found", 404);
    }
    return userBook as unknown as IUserBook;
  }

  async moveBookToShelf(id: string, shelfId: string): Promise<IUserBook> {
    const userBook = await UserBook.findOneAndUpdate(
      { id },
      { shelfId, updatedAt: new Date() },
      { new: true }
    );
    if (!userBook) {
      throw new AppError("User book entry not found", 404);
    }
    return userBook as unknown as IUserBook;
  }

  async removeBookFromLibrary(id: string): Promise<void> {
    const userBook = await UserBook.findOneAndDelete({ id });
    if (!userBook) {
      throw new AppError("User book entry not found", 404);
    }
  }
}

export default new BookService();
