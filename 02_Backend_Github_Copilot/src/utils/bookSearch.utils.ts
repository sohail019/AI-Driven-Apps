import axios from "axios";
import { MasterBook } from "../models/masterBook.model";

interface BookMetadata {
  id?: string;
  title: string;
  authors: string[];
  isbn: string[];
  publisher?: string;
  publishedDate?: string;
  coverImage?: string;
  description?: string;
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  previewLink?: string;
  infoLink?: string;
  source?: string;
  bookData?: {
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

export const searchBook = async (
  query: string
): Promise<BookMetadata | null> => {
  try {
    // First try Google Books API
    const googleResponse = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_API_KEY}`
    );

    if (googleResponse.data.items && googleResponse.data.items.length > 0) {
      const book = googleResponse.data.items[0].volumeInfo;
      const isbn = book.industryIdentifiers?.find(
        (id: any) => id.type === "ISBN_13"
      )?.identifier;

      if (isbn) {
        // Check if book exists in MasterBook
        let masterBook = await MasterBook.findOne({ isbn });
        if (!masterBook) {
          // Create new MasterBook entry
          masterBook = new MasterBook({
            title: book.title,
            authors: book.authors || [],
            isbn,
            publisher: book.publisher,
            coverImage: book.imageLinks?.thumbnail || "",
            publishedDate: book.publishedDate,
            description: book.description,
            pageCount: book.pageCount,
            averageRating: book.averageRating,
            ratingsCount: book.ratingsCount,
            maturityRating: book.maturityRating,
            previewLink: book.previewLink,
            infoLink: book.infoLink,
            source: "GoogleBooks",
            bookData: {
              publisher: book.publisher,
              publishedDate: book.publishedDate,
              description: book.description,
              coverImage: book.imageLinks?.thumbnail,
              pageCount: book.pageCount,
              averageRating: book.averageRating,
              ratingsCount: book.ratingsCount,
              maturityRating: book.maturityRating,
              previewLink: book.previewLink,
              infoLink: book.infoLink,
            },
          });
          await masterBook.save();
        }
        return masterBook.toObject();
      }
    }

    // If not found in Google Books, try Open Library
    const openLibraryResponse = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );

    if (
      openLibraryResponse.data.docs &&
      openLibraryResponse.data.docs.length > 0
    ) {
      const book = openLibraryResponse.data.docs[0];
      const isbn = book.isbn?.[0];

      if (isbn) {
        // Check if book exists in MasterBook
        let masterBook = await MasterBook.findOne({ isbn });
        if (!masterBook) {
          // Create new MasterBook entry
          masterBook = new MasterBook({
            title: book.title,
            authors: book.author_name || [],
            isbn,
            publisher: book.publisher?.[0],
            publishedDate: book.publish_date?.[0],
            coverImage: book.cover?.large || "",
            description: book.description,
            source: "OpenLibrary",
            bookData: {
              publisher: book.publisher?.[0],
              publishedDate: book.publish_date?.[0],
              description: book.description,
            },
          });
          await masterBook.save();
        }
        return masterBook.toObject();
      }
    }

    return null;
  } catch (error) {
    console.error("Error searching for book:", error);
    return null;
  }
};
