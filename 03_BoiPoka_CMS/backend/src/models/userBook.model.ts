import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ISource {
  id: string;
  sourceName: 'Audible' | 'Physical' | 'Kindle';
  sourceType: 'audioBook' | 'physicalBook' | 'eBook';
}

export interface IUserBook extends Document {
  _id: string;
  userId: string;
  libraryId: string;
  masterBookId: string;
  positionId: number;
  readProgress: number;
  source: ISource;
  createdAt: Date;
  updatedAt: Date;
}

const userBookSchema = new Schema<IUserBook>(
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
    libraryId: {
      type: String,
      required: true,
      index: true,
    },
    masterBookId: {
      type: String,
      required: true,
      index: true,
    },
    positionId: {
      type: Number,
      required: true,
      index: true,
    },
    readProgress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    source: {
      id: {
        type: String,
        required: true,
        default: () => uuidv4(),
      },
      sourceName: {
        type: String,
        required: true,
        enum: ['Audible', 'Physical', 'Kindle'],
      },
      sourceType: {
        type: String,
        required: true,
        enum: ['audioBook', 'physicalBook', 'eBook'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimized queries
userBookSchema.index({ userId: 1, libraryId: 1 });
userBookSchema.index({ userId: 1, masterBookId: 1 });
userBookSchema.index({ libraryId: 1, positionId: 1 });

export const UserBook = model<IUserBook>('UserBook', userBookSchema); 