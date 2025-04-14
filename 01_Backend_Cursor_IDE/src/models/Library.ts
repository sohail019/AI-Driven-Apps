import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ILibrary } from "../types/library.types";

const librarySchema = new Schema<ILibrary>({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Library = mongoose.model<ILibrary>("Library", librarySchema);
