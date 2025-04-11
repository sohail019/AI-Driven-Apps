import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  book: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "issued" | "returned" | "overdue";
  fine?: number;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
    },
    fine: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update status based on due date
transactionSchema.pre("save", function (next) {
  if (!this.returnDate && this.dueDate < new Date()) {
    this.status = "overdue";
  }
  next();
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
