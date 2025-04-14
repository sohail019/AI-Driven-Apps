import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { AppError } from "../utils/AppError";
import { IRegisterRequest, ILoginRequest } from "../types/auth.types";

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: IRegisterRequest = req.body;
    const { user, token, refreshToken } = await authService.register(userData);

    res.status(201).json({
      status: "success",
      message:
        "User registered successfully. Please check your email for verification.",
      data: { user, token, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials: ILoginRequest = req.body;
    const { user, token, refreshToken } = await authService.login(credentials);

    res.status(200).json({
      status: "success",
      data: { user, token, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * @route GET /api/auth/verify-email/:token
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    await authService.verifyEmail(token);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.status(200).json({
      status: "success",
      message: "Password reset instructions sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password/:token
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.user._id);
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Error logging out",
    });
  }
};
