import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type InvitationStatus = "pending" | "accepted" | "rejected";

export interface IInnerCircle extends Document {
  _id: string;
  senderId: string;
  receiverId: string; // Can be either userId or mobile number
  receiverName: string;
  libraryId: string;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const innerCircleSchema = new Schema<IInnerCircle>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    libraryId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimized queries
innerCircleSchema.index({ senderId: 1, receiverId: 1, status: 1 });
innerCircleSchema.index({ receiverId: 1, status: 1 });
// innerCircleSchema.index({ libraryId: 1 });

// Ensure unique invitation per library per receiver
innerCircleSchema.index(
  { senderId: 1, receiverId: 1, libraryId: 1 },
  { unique: true }
);

export const InnerCircle = model<IInnerCircle>(
  "InnerCircle",
  innerCircleSchema
);
