import mongoose, { Document, Schema } from "mongoose";

export interface IUserSubscriptionFeatures extends Document {
  userId: mongoose.Types.ObjectId;
  subscriptionPlanId: mongoose.Types.ObjectId;
  features: string[];
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSubscriptionFeaturesSchema = new Schema<IUserSubscriptionFeatures>(
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
    features: [
      {
        type: String,
        required: true,
      },
    ],
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserSubscriptionFeatures =
  mongoose.model<IUserSubscriptionFeatures>(
    "UserSubscriptionFeatures",
    userSubscriptionFeaturesSchema
  );
