import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Role, Permission } from "../types/rbac.types";

export interface IAdmin extends Document {
  id: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.ADMIN,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permission),
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
      required: true,
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

// Indexes
adminSchema.index({ email: 1 });
adminSchema.index({ username: 1 });
adminSchema.index({ role: 1 });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export { Admin };
