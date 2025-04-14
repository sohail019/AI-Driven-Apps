import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { AppError } from "../utils/AppError";
import {
  IAuthResponse,
  IRegisterRequest,
  ILoginRequest,
  IRefreshTokenRequest,
  IEmailVerificationResponse,
  ISuccessResponse,
  IErrorResponse,
} from "../types/auth.types";
import { IUser } from "../models/User";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - mobile
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
export const register = async (
  req: Request<{}, {}, IRegisterRequest>,
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, mobile } = req.body;

    if (!username || !email || !password || !mobile) {
      throw new AppError("All fields are required", 400);
    }

    const result = await authService.registerUser({
      username,
      email,
      password,
      mobile,
    });

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
export const login = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
export const verifyEmail = async (
  req: Request<{ token: string }>,
  res: Response<ISuccessResponse<IEmailVerificationResponse> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new AppError("Verification token is required", 400);
    }

    const result = await authService.verifyEmail(token);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
export const refreshToken = async (
  req: Request<{}, {}, IRefreshTokenRequest>,
  res: Response<ISuccessResponse<{ accessToken: string }> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      status: "success",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
export const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response<ISuccessResponse<{ message: string }> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.status(200).json({
      status: "success",
      data: {
        message: "Password reset instructions sent to your email",
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
export const resetPassword = async (
  req: Request<{ token: string }, {}, { newPassword: string }>,
  res: Response<ISuccessResponse<{ message: string }> | IErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      status: "success",
      data: {
        message: "Password reset successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }
    const user = req.user as IUser;
    await authService.logout(user.id);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
