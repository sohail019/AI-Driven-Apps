import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { SuperAdmin } from "../models/SuperAdmin";
import {
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse,
} from "../types/auth.types";
import { Role } from "../types/rbac.types";
import { AppError } from "../utils/AppError";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import { IUser, IEmailVerificationResponse } from "../types/auth.types";
import crypto from "crypto";

class AuthService {
  private generateAccessToken(user: any, role: Role): string {
    return jwt.sign({ id: user.id, role }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(user: any, role: Role): string {
    return jwt.sign({ id: user.id, role }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  }

  async generateAuthTokens(user: any, role: Role): Promise<IAuthResponse> {
    const accessToken = this.generateAccessToken(user, role);
    const refreshToken = this.generateRefreshToken(user, role);

    // Save refresh token to database
    if (role === Role.SUPERADMIN) {
      await SuperAdmin.findByIdAndUpdate(user.id, { refreshToken });
    } else {
      await User.findByIdAndUpdate(user.id, { refreshToken });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Object containing user data, JWT token, and verification token
   * @throws AppError if registration fails
   */
  async registerUser(data: IRegisterRequest): Promise<IAuthResponse> {
    const { username, email, password, mobile } = data;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      throw new AppError("User with this email or mobile already exists", 400);
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      mobile,
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Save verification token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    return this.generateAuthTokens(user, Role.USER);
  }

  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Object containing user data and JWT tokens
   * @throws AppError if login fails
   */
  async loginUser(data: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate tokens
    return this.generateAuthTokens(user, Role.USER);
  }

  async verifyEmail(token: string): Promise<IEmailVerificationResponse> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findOne({
        _id: decoded.id,
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
    } catch (error) {
      throw new AppError("Invalid or expired verification token", 400);
    }
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

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string
      ) as {
        id: string;
        role: Role;
      };

      // Find user by role
      let user;
      if (decoded.role === Role.SUPERADMIN) {
        user = await SuperAdmin.findById(decoded.id);
      } else {
        user = await User.findById(decoded.id);
      }

      if (!user || (user as any).refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      const accessToken = this.generateAccessToken(user, decoded.role);
      return { accessToken };
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }
}

export const authService = new AuthService();
