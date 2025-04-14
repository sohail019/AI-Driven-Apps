import User from "../models/User";
import { AppError } from "../utils/AppError";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import {
  IUser,
  IRegisterRequest,
  IAuthResponse,
  IEmailVerificationResponse,
} from "../types/auth.types";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await User.findOneAndUpdate(
      { id: userId },
      { refreshToken },
      { new: true }
    );
  }

  private generateAuthTokens(user: IUser): {
    token: string;
    refreshToken: string;
  } {
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    return { token, refreshToken };
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Object containing user data, JWT token, and verification token
   * @throws AppError if registration fails
   */
  async registerUser(userData: IRegisterRequest): Promise<IAuthResponse> {
    const { username, email, password, mobile } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    // Create verification token
    const verificationToken = uuidv4();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await User.create({
      id: uuidv4(),
      username,
      email,
      password,
      mobile,
      verificationToken,
      verificationTokenExpiry,
    });

    // Generate tokens
    const { token, refreshToken } = this.generateAuthTokens(user);
    await this.saveRefreshToken(user.id, refreshToken);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't throw error, just log it
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
      accessToken: token,
      refreshToken,
    };
  }

  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Object containing user data and JWT tokens
   * @throws AppError if login fails
   */
  async loginUser(email: string, password: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isVerified) {
      throw new AppError("Please verify your email first", 403);
    }

    const { token, refreshToken } = this.generateAuthTokens(user);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
      accessToken: token,
      refreshToken,
    };
  }

  async verifyEmail(token: string): Promise<IEmailVerificationResponse> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return {
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
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
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();
      throw new AppError(
        "Failed to send password reset email. Please try again.",
        500
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await User.findOne({ id: decoded.id, refreshToken });

      if (!user) {
        throw new AppError("Invalid refresh token", 401);
      }

      return this.generateToken(user.id);
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }
}

export default new AuthService();
