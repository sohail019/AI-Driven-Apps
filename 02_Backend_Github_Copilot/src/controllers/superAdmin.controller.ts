import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SuperAdmin } from "../models/superAdmin.model";
import { Admin } from "../models/admin.model";
import { OTP } from "../models/otp.model";
import { sendOTP } from "../utils/otp.utils";

export const registerSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({
      $or: [{ email }, { mobile }],
      isDeleted: false,
    });

    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super admin already exists" });
    }

    const superAdmin = await SuperAdmin.create({
      name,
      email,
      mobile,
      password,
    });

    // Generate and send OTP for verification
    const otp = await sendOTP(email, mobile);
    await OTP.create({
      userId: superAdmin._id,
      email,
      mobile,
      otp,
      type: "verification",
    });

    res.status(201).json({
      message:
        "Super admin registered successfully. Please verify your account.",
      superAdmin: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        mobile: superAdmin.mobile,
      },
    });
  } catch (error) {
    console.error("Error registering super admin:", error);
    res.status(500).json({ message: "Error registering super admin" });
  }
};

export const loginSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({
      email,
      isActive: true,
      isDeleted: false,
    });

    if (!superAdmin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!superAdmin.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const token = jwt.sign(
      { _id: superAdmin._id, role: "super-admin" },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      superAdmin: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        mobile: superAdmin.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password, accessTo } = req.body;
    const superAdminId = req.user._id;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { mobile }],
      isDeleted: false,
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name,
      email,
      mobile,
      password,
      accessTo,
      verifiedBy: superAdminId,
    });

    // Generate and send OTP for verification
    const otp = await sendOTP(email, mobile);
    await OTP.create({
      userId: admin._id,
      email,
      mobile,
      otp,
      type: "verification",
    });

    res.status(201).json({
      message: "Admin created successfully. Please verify the account.",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        accessTo: admin.accessTo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const { name, email, mobile, accessTo } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        name,
        email,
        mobile,
        accessTo,
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: "Admin updated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        accessTo: admin.accessTo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin" });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { isDeleted: true },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};

export const activateAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const superAdminId = req.user._id;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        isActive: true,
        activatedBy: superAdminId,
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error activating admin" });
  }
};

export const deactivateAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const superAdminId = req.user._id;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        isActive: false,
        deactivatedBy: superAdminId,
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating admin" });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin" });
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { isDeleted: false };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const admins = await Admin.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(query);

    res.json({
      admins,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};
