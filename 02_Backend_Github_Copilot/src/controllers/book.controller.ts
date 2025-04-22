import { Request, Response } from "express";
import axios from "axios";
import { MasterBook } from "../models/masterBook.model";
import { UserLibrary } from "../models/userLibrary.model";
import { UserBook } from "../models/userBook.model";

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { isbn, title, author } = req.query;

    // Validate that at least one search parameter is provided
    if (!isbn && !title && !author) {
      return res.status(400).json({
        message:
          "At least one search parameter (isbn, title, or author) is required",
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const queryParams = [];
    if (isbn) queryParams.push(`isbn:${isbn}`);
    if (title) queryParams.push(`intitle:${title}`);
    if (author) queryParams.push(`inauthor:${author}`);

    const queryString = queryParams.join("+");
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${queryString}&key=${apiKey}`
    );

    // Check if we got any results
    if (!response.data.items || response.data.items.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found matching the search criteria" });
    }

    // Process the first book from the results
    const bookData = response.data.items[0].volumeInfo;

    // Check if book already exists in master catalog
    const existingBook = await MasterBook.findOne({
      $or: [
        { title: bookData.title },
        {
          isbn: {
            $in:
              bookData.industryIdentifiers?.map((id: any) => id.identifier) ||
              [],
          },
        },
      ],
    });

    if (existingBook) {
      return res.json({
        message: "Book already exists in master catalog",
        book: existingBook,
      });
    }

    // Create new master book
    const masterBook = await MasterBook.create({
      title: bookData.title,
      isbn: bookData.industryIdentifiers?.map((id: any) => id.identifier) || [],
      authors: bookData.authors || [],
      coverImage: bookData.imageLinks?.thumbnail || "",
      genres: bookData.categories || [],
      languages: [bookData.language || "en"],
      bookDimensions: {
        bookColor: "#000000", // Default color
        bookWidth: 0, // Default width
        bookHeight: 0, // Default height
      },
      bookData: {
        publisher: bookData.publisher,
        publishedDate: bookData.publishedDate,
        description: bookData.description,
        pageCount: bookData.pageCount,
        averageRating: bookData.averageRating,
        ratingsCount: bookData.ratingsCount,
        maturityRating: bookData.maturityRating,
        previewLink: bookData.previewLink,
        infoLink: bookData.infoLink,
      },
    });

    res.json({
      message: "Book added to master catalog",
      book: masterBook,
    });
  } catch (error) {
    console.error("Error in searchBooks:", error);
    res.status(500).json({ message: "Error searching books" });
  }
};

export const addMasterBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      isbn,
      authors,
      coverImage,
      genres,
      languages,
      bookColor,
      bookWidth,
      bookHeight,
      bookData,
    } = req.body;

    // Check for existing book
    const existingBook = await MasterBook.findOne({
      $or: [{ title }, { isbn: { $in: isbn } }],
    });

    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book already exists in master catalog" });
    }

    const bookDimensions = {
      bookColor: bookColor ? bookColor : "#000000",
      bookWidth: bookWidth ? bookWidth : 20,
      bookHeight: bookHeight ? bookHeight : 100,
    };

    const masterBook = await MasterBook.create({
      title,
      isbn,
      authors,
      coverImage,
      genres,
      languages,
      bookDimensions: bookDimensions,
    });

    res.status(201).json(masterBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book to master catalog" });
  }
};

export const createLibrary = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const library = await UserLibrary.create({
      userId,
      name,
    });

    res.status(201).json(library);
  } catch (error) {
    res.status(500).json({ message: "Error creating library" });
  }
};

export const addBookToLibrary = async (req: Request, res: Response) => {
  try {
    const { libraryId, masterBookId, userSource } = req.body;
    const userId = req.user._id;

    // Get the last positionId for the library
    const lastBook = await UserBook.findOne({ libraryId })
      .sort({ positionId: -1 })
      .select("positionId");

    const positionId = lastBook ? lastBook.positionId + 1 : 0;

    const userBook = await UserBook.create({
      userId,
      libraryId,
      masterBookId,
      positionId,
      readProgress: 0,
      userSource,
    });

    res.status(201).json(userBook);
  } catch (error) {
    console.error("Error in addBookToLibrary:", error);
    res.status(500).json({ message: "Error adding book to library" });
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { libraryId } = req.query;

    const query: any = { userId };
    if (libraryId) query.libraryId = libraryId;

    const userBooks = await UserBook.find(query)
      .populate("masterBookId")
      .sort({ positionId: 1 });

    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user books" });
  }
};

export const updateBookProgress = async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;
    const { readProgress } = req.body;

    const userBook = await UserBook.findByIdAndUpdate(
      userBookId,
      { readProgress },
      { new: true }
    );

    if (!userBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(userBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book progress" });
  }
};
