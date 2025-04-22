import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IBookData {
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  previewLink?: string;
  infoLink?: string;
}

interface IBookDimensions {
  bookColor?: string;
  bookWidth?: number;
  bookHeight?: number;
}

export interface IMasterBook extends Document {
  _id: string;
  title: string;
  isbn: string[];
  authors: string[];
  coverImage?: string;
  genres: string[];
  rating: number;
  languages: string[];
  bookDimensions: IBookDimensions;
  bookData: IBookData;
  createdAt: Date;
  updatedAt: Date;
}

const masterBookSchema = new Schema<IMasterBook>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    isbn: {
      type: [String],
      required: true,
      index: true,
    },
    authors: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    genres: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    languages: {
      type: [String],
      required: false,
    },
    bookData: {
      publisher: String,
      publishedDate: String,
      description: String,
      pageCount: Number,
      averageRating: Number,
      ratingsCount: Number,
      maturityRating: String,
      previewLink: String,
      infoLink: String,
    },
    bookDimensions: {
      bookColor: String,
      bookWidth: Number,
      bookHeight: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for title and isbn to prevent duplicates
masterBookSchema.index({ title: 1, isbn: 1 }, { unique: true });

export const MasterBook = model<IMasterBook>("MasterBook", masterBookSchema);
