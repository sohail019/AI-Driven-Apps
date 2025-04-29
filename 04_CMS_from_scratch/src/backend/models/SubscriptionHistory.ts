import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriptionHistory extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionPlanId: mongoose.Types.ObjectId;
  changeType: "plan_change" | "feature_change" | "status_change";
  previousPlanId?: mongoose.Types.ObjectId;
  newPlanId?: mongoose.Types.ObjectId;
  previousFeatures?: string[];
  newFeatures?: string[];
  previousStatus?: string;
  newStatus?: string;
  changeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionHistorySchema = new Schema<ISubscriptionHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionPlanId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["plan_change", "feature_change", "status_change"],
      required: true,
    },
    previousPlanId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    newPlanId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    previousFeatures: [
      {
        type: String,
      },
    ],
    newFeatures: [
      {
        type: String,
      },
    ],
    previousStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
    },
    newStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
    },
    changeDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionHistory = mongoose.model<ISubscriptionHistory>(
  "SubscriptionHistory",
  subscriptionHistorySchema
);
