import { Request, Response, NextFunction } from "express";
import bookService from "../services/bookService";
import { AppError } from "../utils/AppError";

export const createBookFromISBN = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isbn } = req.body;
    if (!isbn) {
      throw new AppError("ISBN is required", 400);
    }
    const book = await bookService.createBookFromISBN(isbn);
    res.status(201).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;
    if (!query) {
      throw new AppError("Search query is required", 400);
    }
    const books = await bookService.searchBooks(query as string);
    res.status(200).json({
      status: "success",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    const book = await bookService.updateBook(id, bookData);
    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await bookService.deleteBook(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addBookToLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId, libraryId, shelfId } = req.body;
    const userId = req.user.id;
    const userBook = await bookService.addBookToLibrary({
      bookId,
      userId,
      libraryId,
      shelfId,
      status: "PLANNED",
    });
    res.status(201).json({
      status: "success",
      data: userBook,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { libraryId, shelfId } = req.query;
    const userBooks = await bookService.getUserBooks(
      userId,
      libraryId as string,
      shelfId as string
    );
    res.status(200).json({
      status: "success",
      data: userBooks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserBookStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userBook = await bookService.updateUserBookStatus(id, status);
    res.status(200).json({
      status: "success",
      data: userBook,
    });
  } catch (error) {
    next(error);
  }
};

export const moveBookToShelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { shelfId } = req.body;
    const userBook = await bookService.moveBookToShelf(id, shelfId);
    res.status(200).json({
      status: "success",
      data: userBook,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookFromLibrary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await bookService.removeBookFromLibrary(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
