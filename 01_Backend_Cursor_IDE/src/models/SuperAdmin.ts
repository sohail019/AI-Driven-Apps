import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../types/rbac.types";

export interface ISuperAdmin {
  _id: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  isVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: true, // Superadmin is always verified
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Pre-save middleware to generate UUID for _id
superAdminSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = uuidv4();
  }
  next();
});

// Hash password before saving
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
superAdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const SuperAdmin = mongoose.model<ISuperAdmin>(
  "SuperAdmin",
  superAdminSchema
);
