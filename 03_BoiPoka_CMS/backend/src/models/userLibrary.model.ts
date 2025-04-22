import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUserLibrary extends Document {
  _id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userLibrarySchema = new Schema<IUserLibrary>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for userId and name to prevent duplicate library names per user
userLibrarySchema.index({ userId: 1, name: 1 }, { unique: true });

export const UserLibrary = model<IUserLibrary>('UserLibrary', userLibrarySchema); 