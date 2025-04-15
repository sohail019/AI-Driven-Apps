import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { IAdminLoginRequest, IAdminAuthResponse } from "../types/admin.types";
import { Role } from "../types/rbac.types";
import bcrypt from "bcryptjs";

export const loginAdmin = async (
  req: Request<{}, {}, IAdminLoginRequest>,
  res: Response<IAdminAuthResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user by email and role (SUPERADMIN or ADMIN)
    const user = await User.findOne({
      email,
      role: { $in: [Role.SUPERADMIN, Role.ADMIN] },
    }).select("+password");

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Ensure permissions is not undefined
    const permissions = user.permissions || [];

    // Generate tokens
    const accessToken = generateToken(
      { id: user.id, role: user.role, permissions },
      "1h"
    );
    const refreshToken = generateToken(
      { id: user.id, role: user.role, permissions },
      "7d"
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
    res.status(200).json({
      admin: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        permissions,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Find user by refresh token and role
    const user = await User.findOne({
      refreshToken,
      role: { $in: [Role.SUPERADMIN, Role.ADMIN] },
    });

    if (!user) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Ensure permissions is not undefined
    const permissions = user.permissions || [];

    // Generate new access token
    const accessToken = generateToken(
      { id: user.id, role: user.role, permissions },
      "1h"
    );

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    // Clear refresh token
    await User.findOneAndUpdate(
      { refreshToken, role: { $in: [Role.SUPERADMIN, Role.ADMIN] } },
      { $set: { refreshToken: null } }
    );

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
