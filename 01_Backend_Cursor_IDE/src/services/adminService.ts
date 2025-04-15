import { Model } from "mongoose";
import {
  IAdminCreateRequest,
  IAdminUpdateRequest,
  Role,
  Permission,
} from "../types/rbac.types";
import { AppError } from "../utils/AppError";
import { Admin, IAdmin } from "../models/Admin";
import { SuperAdmin } from "../models/SuperAdmin";

class AdminService {
  private adminModel: Model<IAdmin>;
  constructor() {
    this.adminModel = Admin;
  }

  async createAdmin(
    adminData: IAdminCreateRequest,
    createdBy: string
  ): Promise<IAdmin> {
    // Check if creator is superadmin
    const creator = await SuperAdmin.findById(createdBy);
    if (!creator) {
      throw new AppError("Only superadmin can create admins", 403);
    }

    // Check if admin already exists
    const existingAdmin = await this.adminModel.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingAdmin) {
      throw new AppError(
        "Admin with this email or username already exists",
        400
      );
    }

    // Create admin
    const admin = await this.adminModel.create({
      ...adminData,
      role: Role.ADMIN,
      createdBy: creator._id,
    });

    return admin;
  }

  async updateAdmin(
    adminId: string,
    updateData: IAdminUpdateRequest,
    updatedBy: string
  ): Promise<IAdmin> {
    // Check if updater is superadmin
    const updater = await SuperAdmin.findById(updatedBy);
    if (!updater) {
      throw new AppError("Only superadmin can update admins", 403);
    }

    // Check if admin exists
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    // Update admin
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      throw new AppError("Failed to update admin", 500);
    }

    return updatedAdmin;
  }

  async getAdmins(): Promise<IAdmin[]> {
    return this.adminModel.find().select("-password");
  }

  async getAdminById(adminId: string): Promise<IAdmin> {
    const admin = await this.adminModel.findById(adminId).select("-password");
    if (!admin) {
      throw new AppError("Admin not found", 404);
    }
    return admin;
  }
}

export default new AdminService();
