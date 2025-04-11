import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  ISBN: string;
  quantity: number;
  availableQuantity: number;
  category: string;
  description?: string;
  publishedYear?: number;
  status: "available" | "unavailable";
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to ensure availableQuantity doesn't exceed quantity
bookSchema.pre("save", function (next) {
  if (this.availableQuantity > this.quantity) {
    this.availableQuantity = this.quantity;
  }
  next();
});

export default mongoose.model<IBook>("Book", bookSchema);
