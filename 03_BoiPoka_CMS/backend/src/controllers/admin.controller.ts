import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model";
import { OTP } from "../models/otp.model";
import { sendOTP } from "../utils/otp.utils";
import { User } from "../models/user.model";
import { MasterBook } from "../models/masterBook.model";
import { UserBook } from "../models/userBook.model";
import { UserLibrary } from "../models/userLibrary.model";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email,
      isActive: true,
      isDeleted: false,
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const token = jwt.sign(
      { _id: admin._id, role: "admin" },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        accessTo: admin.accessTo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({
      email,
      isActive: true,
      isDeleted: false,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const validOTP = await OTP.findOne({
      userId: admin._id,
      email,
      otp,
      type: "password-reset",
      expiresAt: { $gt: new Date() },
    });

    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.password = newPassword;
    await admin.save();

    // Delete the used OTP
    await OTP.findByIdAndDelete(validOTP._id);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({
      email,
      isActive: true,
      isDeleted: false,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = await sendOTP(admin._id, "password-reset", email, admin.mobile);
    console.log(otp);
    // await OTP.create({
    //   userId: admin._id,
    //   email,
    //   mobile: admin.mobile,
    //   otp,
    //   type: "password-reset",
    // });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// User Management
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { isDeleted: false };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error activating user" });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating user" });
  }
};

// Book Management
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    const books = await MasterBook.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await MasterBook.countDocuments(query);

    res.json({
      books,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const userBooks = await UserBook.find({ userId })
      .populate("masterBookId")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await UserBook.countDocuments({ userId });

    res.json({
      userBooks,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user books" });
  }
};

export const updateUserBookProgress = async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;
    const { readProgress } = req.body;

    const userBook = await UserBook.findByIdAndUpdate(
      userBookId,
      { readProgress },
      { new: true }
    ).populate("masterBookId");

    if (!userBook) {
      return res.status(404).json({ message: "User book not found" });
    }

    res.json(userBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book progress" });
  }
};

export const deleteUserBook = async (req: Request, res: Response) => {
  try {
    const { userBookId } = req.params;

    const userBook = await UserBook.findByIdAndDelete(userBookId);

    if (!userBook) {
      return res.status(404).json({ message: "User book not found" });
    }

    res.json({ message: "User book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user book" });
  }
};

// Analytics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalBooks,
      totalUserBooks,
      genreDistribution,
      sourceDistribution,
      topBooks,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ isActive: true, isDeleted: false }),
      MasterBook.countDocuments(),
      UserBook.countDocuments(),
      MasterBook.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: "$genres", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      UserBook.aggregate([
        { $group: { _id: "$userSource.sourceName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      UserBook.aggregate([
        {
          $group: {
            _id: "$masterBookId",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "masterbooks",
            localField: "_id",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        {
          $project: {
            _id: "$book._id",
            title: "$book.title",
            authors: "$book.authors",
            coverImage: "$book.coverImage",
            count: 1,
          },
        },
      ]),
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalBooks,
      totalUserBooks,
      genreDistribution,
      sourceDistribution,
      topBooks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
