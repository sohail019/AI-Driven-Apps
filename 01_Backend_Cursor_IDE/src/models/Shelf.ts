import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IShelf } from "../types/library.types";

const shelfSchema = new Schema<IShelf>({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  libraryId: { type: String, required: true, ref: "Library" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Shelf = mongoose.model<IShelf>("Shelf", shelfSchema);
