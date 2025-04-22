import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface ISuperAdmin extends Document {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid mobile number'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: 'super-admin',
      enum: ['super-admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: String,
      ref: 'SuperAdmin',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
superAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
superAdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// superAdminSchema.index({ email: 1 }, { unique: true });
// superAdminSchema.index({ mobile: 1 }, { unique: true });
superAdminSchema.index({ isActive: 1 });
superAdminSchema.index({ isDeleted: 1 });

export const SuperAdmin = model<ISuperAdmin>('SuperAdmin', superAdminSchema); 