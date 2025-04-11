import Book, { IBook } from "../models/Book";
import mongoose from "mongoose";

class BookService {
  async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const book = new Book(bookData);
    return await book.save();
  }

  async getAllBooks(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ books: IBook[]; total: number; pages: number }> {
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { ISBN: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      books,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getBookById(id: string): Promise<IBook | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid book ID");
    }
    return await Book.findById(id);
  }

  async updateBook(
    id: string,
    updateData: Partial<IBook>
  ): Promise<IBook | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid book ID");
    }
    return await Book.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteBook(id: string): Promise<IBook | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid book ID");
    }
    return await Book.findByIdAndDelete(id);
  }

  async updateBookAvailability(
    id: string,
    increment: boolean
  ): Promise<IBook | null> {
    const update = increment
      ? { $inc: { availableQuantity: 1 } }
      : { $inc: { availableQuantity: -1 } };

    return await Book.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }
}

export default new BookService();
