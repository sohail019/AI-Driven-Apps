import mongoose, { Document, Schema } from "mongoose";

export interface IFreeFeatures extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const freeFeaturesSchema = new Schema<IFreeFeatures>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FreeFeatures = mongoose.model<IFreeFeatures>(
  "FreeFeatures",
  freeFeaturesSchema
);
