import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../models/User";
import User from "../models/User";
import emailService from "./emailService";
import {
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse,
} from "../types/auth.types";
import { AppError } from "../utils/AppError";

class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Object containing user data, JWT token, and verification token
   * @throws AppError if registration fails
   */
  async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }],
      });

      if (existingUser) {
        throw new AppError(
          "User with this email or username already exists",
          400
        );
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpiry = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      // Create new user
      const user = new User({
        ...userData,
        verificationToken,
        verificationTokenExpiry,
      });
      await user.save();

      // Send verification email
      try {
        await emailService.sendVerificationEmail(user.email, verificationToken);
      } catch (error) {
        // If email fails, delete the user and throw error
        await User.findByIdAndDelete(user._id);
        throw new AppError(
          "Failed to send verification email. Please try again.",
          500
        );
      }

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // Prepare response
      const response: IAuthResponse = {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
      };

      return response;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Registration failed", 500);
    }
  }

  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Object containing user data and JWT tokens
   * @throws AppError if login fails
   */
  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    try {
      // Find user by email
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
      }

      // Check email verification
      if (!user.isVerified) {
        throw new AppError("Please verify your email first", 403);
      }

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // Prepare response
      const response: IAuthResponse = {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
      };

      return response;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Login failed", 500);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // If email fails, reset the token
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpiry = null;
      await user.save();
      throw new Error("Failed to send password reset email. Please try again.");
    }

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Generate JWT token
   * @param user - User object
   * @returns JWT token
   */
  private generateToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "15m" }
    );
  }

  /**
   * Generate refresh token
   * @param user - User object
   * @returns Refresh token
   */
  private generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_here",
      { expiresIn: "7d" }
    );
  }
}

export default new AuthService();
