import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUserBook } from "../types/library.types";

const userBookSchema = new Schema<IUserBook>({
  id: { type: String, default: uuidv4, unique: true },
  bookId: { type: String, required: true, ref: "Book" },
  userId: { type: String, required: true, ref: "User" },
  libraryId: { type: String, required: true, ref: "Library" },
  shelfId: { type: String, required: true, ref: "Shelf" },
  status: {
    type: String,
    enum: ["READING", "COMPLETED", "PLANNED"],
    default: "PLANNED",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserBook = mongoose.model<IUserBook & Document>(
  "UserBook",
  userBookSchema
);
