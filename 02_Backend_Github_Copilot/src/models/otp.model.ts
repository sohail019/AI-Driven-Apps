import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IOTP extends Document {
  _id: string;
  userId: string;
  type: 'email' | 'mobile' | 'password-reset';
  code: string;
  expiresAt: Date;
  retryCount: number;
  lastRetryAt?: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['email', 'mobile', 'password-reset'],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: {
      type: Date,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
otpSchema.index({ userId: 1, type: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = model<IOTP>('OTP', otpSchema); 