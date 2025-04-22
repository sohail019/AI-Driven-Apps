import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export type AdminPermission = 
  | 'get-user'
  | 'deactivate-user'
  | 'activate-user'
  | 'get-book'
  | 'delete-userbooks'
  | 'get-userbooks'
  | 'genre'
  | 'update-userbooks'
  | 'delete-users';

export interface IAdmin extends Document {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  verifiedBy: string;
  accessTo: AdminPermission[];
  activatedBy?: string;
  deactivatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
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
      default: 'admin',
      enum: ['admin'],
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
      required: true,
    },
    accessTo: {
      type: [String],
      required: true,
      enum: [
        'get-user',
        'deactivate-user',
        'activate-user',
        'get-book',
        'delete-userbooks',
        'get-userbooks',
        'genre',
        'update-userbooks',
        'delete-users',
      ],
    },
    activatedBy: {
      type: String,
      ref: 'SuperAdmin',
    },
    deactivatedBy: {
      type: String,
      ref: 'SuperAdmin',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
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
adminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
// adminSchema.index({ email: 1 }, { unique: true });
// adminSchema.index({ mobile: 1 }, { unique: true });
adminSchema.index({ isActive: 1 });
adminSchema.index({ isDeleted: 1 });
adminSchema.index({ verifiedBy: 1 });
adminSchema.index({ accessTo: 1 });

export const Admin = model<IAdmin>('Admin', adminSchema); 