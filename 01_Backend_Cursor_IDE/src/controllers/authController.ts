import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import {
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse,
  IErrorResponse,
  ISuccessResponse,
  IEmailVerificationResponse,
  IUser,
} from "../types/auth.types";
import { Role } from "../types/rbac.types";
import { SuperAdmin } from "../models/SuperAdmin";
import User from "../models/User";

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
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>
) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
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
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>
) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
};

export const superadminLogin = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>
) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email }).select("+password");

    if (!superAdmin) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await (superAdmin as any).comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const result = await authService.generateAuthTokens(
      superAdmin,
      Role.SUPERADMIN
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
};

export const adminLogin = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response<ISuccessResponse<IAuthResponse> | IErrorResponse>
) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({
      email,
      role: Role.ADMIN,
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await (admin as any).comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const result = await authService.generateAuthTokens(admin, Role.ADMIN);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
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
  req: Request,
  res: Response<ISuccessResponse<IEmailVerificationResponse> | IErrorResponse>
) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
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
  req: Request,
  res: Response<ISuccessResponse<{ accessToken: string }> | IErrorResponse>
) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
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
    const user = req.user as unknown as IUser;
    await authService.logout(user.id);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
