import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IBook } from "../types/library.types";

const bookSchema = new Schema<IBook>({
  id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Book = mongoose.model<IBook>("Book", bookSchema);
